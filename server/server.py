from collections import defaultdict
# import fitz
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_file
import requests
from ocr import *
import os
# from summary import create_summary # need to find a better model and fine-tune that
from flask_cors import CORS
# import pypandoc # converting .docx to pdf
from fpdf import FPDF
from email_validator import validate_email, EmailNotValidError
import firebase_admin
from firebase_admin import credentials, storage
from dotenv import load_dotenv
import io
import codecs
from werkzeug.exceptions import RequestEntityTooLarge
from langchain_chroma import Chroma
from langchain.docstore.document import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.generativeai as genai

load_dotenv()
os.environ["TOKENIZERS_PARALLELISM"] = "false"
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

firebase_admin.initialize_app(
    credentials.Certificate({ \
        "type": "service_account", \
        "project_id": os.environ.get('PROJECT_ID'), \
        "private_key_id": os.environ.get('PRIVATE_KEY_ID'), \
        "private_key": os.environ.get('PRIVATE_KEY').replace('\\n', '\n'), \
        "client_email": os.environ.get('CLIENT_EMAIL'), \
        "client_id": os.environ.get('CLIENT_ID'), \
        "auth_uri": os.environ.get('AUTH_URI'), \
        "token_uri": os.environ.get('TOKEN_URI'), \
        "auth_provider_x509_cert_url": os.environ.get('AUTH_PROVIDER_X509_CERT_URL'), \
        "client_x509_cert_url": os.environ.get('CLIENT_X509_CERT_URL'), \
    }), {'storageBucket': os.environ.get('STORAGE_BUCKET')})

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024 # 100MB
CORS(app)
bucket = storage.bucket()

# Endpoint to check the existence of files for this given user in the database
@app.route("/check_files", methods = ["GET"])
def return_file_count():
    username = request.args.get("username")
    blobs = list(bucket.list_blobs(prefix=f"{username}/"))
    if len(blobs) > 0:
        return jsonify({"filesExist": True})
    return jsonify({"filesExist": False})

# Endpoint for fetching all the files uploaded by the current user.
@app.route("/fetch_files", methods = ["GET"])
def get_files():
    username = request.args.get("username")
    blobs = list(bucket.list_blobs(prefix=f"{username}/"))
    blobs = list(map(lambda blob: blob.name[blob.name.rfind("/") + 1:], blobs))
    return jsonify({"files": blobs})

@app.route("/check-email-validity", methods = ["GET"])
def check_validity():
    email = request.args.get("email")
    try:
        res = validate_email(email, check_deliverability=True)
        return jsonify({"result": res.normalized, "status": 200})
    except EmailNotValidError as err:
        print(f"Error: {err}")
        return jsonify({"result": str(err), "status": 500})
    except Exception:
        return jsonify({"result": "Internal server error", "status": 500})
    
# Endpoint to handle file processing and sending it back to the frontend for upload to cloud storage
@app.route("/upload_file", methods = ["POST"])
def process_uploaded_file():
    try:
        if request.method == "POST" and "upload" in request.files:
            username = request.args.get("username")
            file = request.files["upload"]
            name = file.filename

            # if there's no extension associated with the file
            if name.rfind(".") == -1:
                return jsonify({"status": "You need to upload a file that has an extension"})
            
            # if this file has already been uploaded previously
            blobs = list(bucket.list_blobs(prefix=f"{username}/"))
            if len(blobs) > 0:
                blobs = list(map(lambda blob: blob.name[blob.name.rfind("/") + 1:], blobs))
                if name[:name.rfind(".")] + ".pdf" in blobs:
                    return jsonify({"status": "This file already exists. Please select a different one and try again"})
            
            # check if this file has a valid extension
            extension = name[name.rfind(".") + 1:]
            if extension != "pdf":
                return jsonify({"status": "Make sure you upload a PDF file only!"})
            
            # if extension not in ["pdf", "docx", "txt"]:
            #     return jsonify({"status": "Make sure you upload a PDF, TXT, or DOCX file only!"})

            # check whether file is not empty after determinining if its a valid document to ensure tesseract compatibility
            file.seek(0, os.SEEK_END)
            bytes = file.tell()
            if bytes == 0:
                return jsonify({"status": "Please make sure you upload a non-empty document"})
            file.seek(0)

            return jsonify({"status": "PDF OK"})
            
            # output_name = name if extension == 'pdf' else name[:name.rfind('.')] + '.pdf'
            # print(f"Output name: {output_name}")
            # blob = bucket.blob(f"{username}/{output_name}")

            # if extension == "pdf":
            #     # return jsonify({"status": "PDF OK"})
            #     blob.upload_from_file(file, content_type='application/pdf')
            # else:
            #     contents = file.read()
            #     output_file = io.BytesIO()
            #     pypandoc.convert_text(contents, to = "pdf", format = "docx" if extension == "docx" else "markdown", outputfile=output_file)
            #     output_file.seek(0)
            #     # assert res == ""
            #     # print(f"contents: {output_file.read()}")
            #     # return send_file(output_file, mimetype="application/pdf")
            #     blob.upload_from_string(output_file.read(), content_type="application/pdf")
            
            # return jsonify({"status": "File uploaded successfully"})

            # if not os.path.exists(FILE_DIR):
            #     os.makedirs(FILE_DIR)
            # file.save(os.path.join(FILE_DIR, name))
            
            # match extension:
            #     case "docx":
            #         output = pypandoc.convert_file(os.path.join(FILE_DIR, name), "pdf", outputfile=os.path.join(FILE_DIR, name[:name.index(".")] + ".pdf"), extra_args=['--pdf-engine=pdflatex'])
            #         assert output == ""
            #         os.remove(os.path.join(FILE_DIR, name))
            #     case "txt":
            #         pdf = FPDF()

            #         with open(os.path.join(FILE_DIR, name), "r") as new_file:
            #             lines = new_file.readlines()
            #             lines = list(map(lambda t: t.strip(), lines))

            #             pdf.set_auto_page_break(auto=True, margin=15)
            #             pdf.add_page()
            #             pdf.set_font("Arial", size=10)

            #             for line in lines:
            #                 pdf.multi_cell(0, 5, line)
                    
            #             pdf.output(os.path.join(FILE_DIR, name[:name.index(".")] + ".pdf")) 

            #         os.remove(os.path.join(FILE_DIR, name))
            # return jsonify({"status": "File uploaded successfully"}) 
    except RequestEntityTooLarge as e:
        print(e)
        return jsonify({"status": "File uploaded exceedss the maximum size of 100MB. Please select a different one and try again!"})
    except Exception as e: 
        print(e)
        return jsonify({"status": "Error when uploading the file. Please try again!"})

def extract_file_contents(file_bytes: bytes) -> Dict[str, str]:
    print(f"converting file to images...")
    pdf_images = convert_to_image(file_bytes)
    print(f"images converted. now extracting text")
    text_contents = process_pdf_page(pdf_images) 
    return text_contents

# Endpoint for generating summary of text and sending that back to the server along with the calculated text statistics
@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    username, file = request.args.get("username"), request.args.get("file")
    blob = bucket.blob(f"{username}/{file}")
    doc_url = blob.generate_signed_url(expiration=datetime.now() + timedelta(hours=24))
    req = requests.get(doc_url)
    assert req.status_code == 200
    text_contents = extract_file_contents(req.content) # req.content represents the bytes of the file
    text_statistics = calculate_text_statistics(text_contents)

    print(f"text contents: {text_contents}")

    summarized_text = defaultdict(str)
    for page in text_contents:
        summarized_text[page] = ""
        # summarized_text[page] = create_summary(text_contents[page])

    # returning a dictionary that contains a page-by-page summary of the document
    return jsonify({"summarized_text": list(summarized_text.items()), "statistics": text_statistics, "username": username})

# Endpoint to handle the task of answering questions about a specific document the user chooses
    # convert this to a conversational RAG based chatbot

@app.route("/get_model_response", methods = ["POST"])
def fetch_response():
    data = request.json
    query, file = data.get("query"), data.get("file")
    username, history = data.get("username"), data.get("history")

    blob = bucket.blob(f"{username}/{file}")
    url = blob.generate_signed_url(datetime.now() + timedelta(hours=24))
    req = requests.get(url)
    assert req.status_code == 200
    text_contents = extract_file_contents(req.content)

    docs = []
    for page in text_contents:
        docs.append(Document(page_content=text_contents[page], metadata={"source": file}))
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = splitter.split_documents(docs)
    # db = Chroma.from_documents()

    # text_contents = extract_file_contents(request.args.get("file"))
    # extracted_text = ""
    # for content in text_contents:
    #     extracted_text += " ".join(text_contents[content])
    # response = answer_questions(extracted_text, query)
    return jsonify({"response": ""})

# Endpoint to handle the task of generating questions of specific types on a specific document the user chooses

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    question_types = request.args.get("questionTypes") # array of all the selected options
    file = request.args.get("file")
    username = request.args.get("username")

    main_blob = bucket.blob(f"{username}/{file}")
    download_url = main_blob.generate_signed_url(datetime.now() + timedelta(hours=24))
    req = requests.get(download_url)
    assert req.status_code == 200
    text_contents = extract_file_contents(req.content)

    docs = []
    for page in text_contents:
        docs.append(Document(page_content=text_contents[page], metadata={"source": file}))
        
    splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=400)
    split_docs = splitter.split_documents(docs)

    # creating chunks of size 5 further from the split_documents
    doc_groups = []
    if len(split_docs) >= 15:
        for i in range(0, len(split_docs), 5):
            doc_groups.append(split_docs[i:i+5])

    system_prompt = f"You are a highly knowledgeable assistant tasked with generating insightful and useful questions based on the provided document text. Your goal is to help a user deepen their understanding of the document's content, whether they are studying for a test, preparing for a discussion, or seeking a more comprehensive grasp of the material. Depending on the text and its content, generate either one question or multiple questions that are clear, thought-provoking, and cover key concepts and details presented in the text. Ensure that the questions span the following types, if appropriate: {question_types.split(',')}. Include answer choices for multiple-choice questions and ensure all questions are in the same format without any headers. If the text block does not contain enough information to generate meaningful questions, simply respond with 'N/A'. Only provide the question(s) and not the answer(s)."

    def inject_prompt(text: str) -> str:
        return f"Generate a question or several questions based on the following text block.\n Text block: {text}"
    
    questions = []
    model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_prompt)
    # number of split documents is < 10
    if not doc_groups:
        for doc in split_docs:
            content = doc.page_content
            response = model.generate_content(inject_prompt(content))
            questions.append(response.text)
    # number of split documents >= 10
    else:
        for group in doc_groups:
            text = "\n\n".join(doc.page_content for doc in group)
            response = model.generate_content(inject_prompt(text))
            questions.append(response.text)
    
    pdf = FPDF()

    pdf.add_page()
    pdf.set_font("Arial", size=10)
    
    start = 1
    for question in questions:
        if question != "N/A":
            # handle encoding of characters outside the default range(ignore instead of replacing them)
            pdf.multi_cell(0, 5, f"{start}. {question}\n")
            start += 1
    
    # cannot do pdf.output(result_file) because it thinks result_file is the name of a file which is not true
    # to write to the binary file, pdf contents need to be converted to bytes
    # encoding needed to convert string into bytes that is compatible with the write function
    result_file = io.BytesIO()
    result_file.write(pdf.output(dest="S").encode("latin-1"))
    result_file.seek(0)

    return send_file(result_file, mimetype="application/pdf", as_attachment=True, download_name=f"{file[:file.rfind('.')]}-generatedQuestions.pdf")

if __name__ == "__main__":
    app.run(debug = True)