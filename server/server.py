from collections import defaultdict
import fitz
from flask import Flask, jsonify, request
from ocr import *
import os
from summary import create_summary # need to find a better model and fine-tune that
from flask_cors import CORS
import pypandoc # converting .txt and .docx to pdf(need to install the engine)
from fpdf import FPDF
from email_validator import validate_email, EmailNotValidError
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv

# potential logic for working with the pdf files stored in firebase storage
    # obtain a download link to the pdf
    # make a fetch request to it
    # use pdf2image's convert_from_bytes function to get the images

load_dotenv()
os.environ["TOKENIZERS_PARALLELISM"] = "false"
FILE_DIR = "../uploads"

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
    }))
app = Flask(__name__)
CORS(app)


def extract_file_contents(file_name: str) -> Dict[str, str]:
    target_file = os.path.join(FILE_DIR, file_name)
    pdf_images = convert_to_image(target_file)
    text_contents = process_pdf_page(pdf_images) 
    return text_contents

# Endpoint to check the existence of files in the uploaded folder

@app.route("/check_files", methods = ["GET"])
def return_file_count():
    if not os.path.exists(FILE_DIR):
        os.makedirs(FILE_DIR)
    files = os.listdir(FILE_DIR)
    if len(files) == 0:
        return jsonify({"filesExist": False})
    else:
        return jsonify({"filesExist": True})

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

@app.route("/firebase-email-existence", methods = ["GET"])
def verify_email():
    email = request.args.get("email")
    try:
        user_record = auth.get_user_by_email(email)
        print(user_record)
        return jsonify({"status": "Success"})
    except ValueError:
        return jsonify({"status": "Invalid email format. Please enter a valid one and try again!"})
    except auth.UserNotFoundError:
        return jsonify({"status": "This email is non-existent. Please enter a valid one and try again!"})
    
# Endpoint to handle the file upload to the specific folder

@app.route("/upload_file", methods = ["POST"])
def save_uploaded_file():
    # upload(for attribute of label tag, id and name of input tag)
    try:
        if request.method == "POST" and "upload" in request.files:
            if not os.path.exists(FILE_DIR):
                os.makedirs(FILE_DIR)
            file = request.files["upload"]
            name = file.filename
            # if there's no extension associated with the file
            if name.rfind(".") == -1:
                return jsonify({"status": "You need to upload a file that has an extension"})
            # if this file has already been uploaded previously
            if name[:name.rfind(".")] + ".pdf" in os.listdir(FILE_DIR):
                return jsonify({"status": "This file already exists. Please select a different one and try again"})
            extension = name[name.rfind(".") + 1:]
            if extension not in ["pdf", "docx", "txt"]:
                return jsonify({"status": "Make sure you upload a PDF, TXT, or DOCX file only!"})
            file.save(os.path.join(FILE_DIR, name))
            # once we have determined that the file is valid we check whether it is not empty otherwise teserract will throw an error
            # we need a valid path to check this so we save the file first do the check and then get rid of it
            if os.path.getsize(os.path.join(FILE_DIR, name)) == 0:
                os.remove(os.path.join(FILE_DIR, name))
                return jsonify({"status": "Please make sure you upload a non-empty document"})
            match extension:
                case "docx":
                    output = pypandoc.convert_file(os.path.join(FILE_DIR, name), "pdf", outputfile=os.path.join(FILE_DIR, name[:name.index(".")] + ".pdf"), extra_args=['--pdf-engine=pdflatex'])
                    assert output == ""
                    os.remove(os.path.join(FILE_DIR, name))
                case "txt":
                    pdf = FPDF()

                    with open(os.path.join(FILE_DIR, name), "r") as new_file:
                        lines = new_file.readlines()
                        lines = list(map(lambda t: t.strip(), lines))

                        pdf.set_auto_page_break(auto=True, margin=15)
                        pdf.add_page()
                        pdf.set_font("Arial", size=10)

                        for line in lines:
                            pdf.multi_cell(0, 5, line)
                    
                        pdf.output(os.path.join(FILE_DIR, name[:name.index(".")] + ".pdf")) 

                    os.remove(os.path.join(FILE_DIR, name))
            return jsonify({"status": "File uploaded successfully"}) 
    except:
        return jsonify({"status": "Error when uploading the file. Please try again!"})

# Endpoint for generating summary of text and sending that back to the server along with the calculated text statistics

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    text_contents = extract_file_contents(request.args.get("file"))
    text_statistics = calculate_text_statistics(text_contents)
    summarized_text = defaultdict(str)
    for page in text_contents:
        summarized_text[page] = create_summary(text_contents[page])
    print(summarized_text)
    # returning a dictionary that contains a page-by-page summary of the document
    return jsonify({"summarized_text": summarized_text, "statistics": text_statistics})

# Endpoint for fetching all the files uploaded by the current user. Need to eventually transition to having user accounts and fetching files from a database instead of locally

@app.route("/fetch_files", methods = ["GET"])
def get_files():
    return jsonify({"files": os.listdir(FILE_DIR)})

# Endpoint to handle the task of answering questions about a specific document the user chooses

@app.route("/get_model_response", methods = ["GET"])
def fetch_response():
    query = request.args.get("query")
    text_contents = extract_file_contents(request.args.get("file"))
    extracted_text = ""
    for content in text_contents:
        extracted_text += " ".join(text_contents[content])
    # response = answer_questions(extracted_text, query)
    return jsonify({"response": ""})

# Endpoint to handle the task of generating questions of specific types on a specific document the user chooses

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    question_types = request.args.get("questionTypes") # array of all the selected options
    # print(question_types)
    filename = request.args.get("file")
    text_contents = extract_file_contents(filename)
    extracted_text = ""
    for content in text_contents:
        extracted_text += " ".join(text_contents[content])
    # response = generate_questions(extracted_text, question_types)

    if not os.path.exists("../generatedQuestions"):
        os.makedirs("../generatedQuestions")
    
    # this logic of saving generated questions locally is fine but perhaps give the user flexibility to choose which directory on their local machine they want to save the pdf in + explore better options to write text to a pdf apart from the one below

    doc = fitz.open()
    page = doc._newPage(width=600, height=845)
    where = fitz.Point(45, 100)
    # page.insert_text(where, response, fontsize=8)
    doc.save(f"../generatedQuestions/{filename[:len(filename) - 4]}-generatedQuestions.pdf")

    return jsonify({"status": "PDF Generated Successfully"})

if __name__ == "__main__":
    app.run(debug = True)