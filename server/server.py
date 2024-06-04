import fitz
from flask import Flask, jsonify, request
from ocr import *
import os
from summary import create_summary # need to find a better model and fine-tune that
from flask_cors import CORS
from gpt import *

app = Flask(__name__, static_url_path='/static')
CORS(app)

def extract_file_contents(file_name):
    target_file = os.path.join("../uploads", file_name)
    pdf_images = convert_to_image(target_file)
    text_contents = process_pdf_page(pdf_images) 
    return text_contents

# Endpoint to check the existence of files in the uploaded folder

@app.route("/check_files", methods = ["GET"])
def return_file_count():
    if not os.path.exists("../uploads"):
        os.makedirs("../uploads")
    files = os.listdir("../uploads")
    if len(files) == 0:
        return jsonify({"filesExist": False})
    else:
        return jsonify({"filesExist": True})

# Endpoint to handle the file upload to the specific folder

@app.route("/upload_file", methods = ["POST"])
def save_uploaded_file():
    if request.method == "POST":
        if "upload" in request.files: # upload(for attribute of label tag, id and name of input tag)
            file = request.files["upload"]
            if file.filename.endswith(".pdf"):
                if not os.path.exists("../uploads"):
                    os.makedirs("../uploads")
                file.save(os.path.join("../uploads", file.filename))
                return jsonify({"status": "File uploaded successfully"})
            else:
                return jsonify({"status": "Make sure you upload a PDF file only!"})
    return jsonify({"status": "Make sure you have provided a file"})

# Endpoint for generating summary of text and sending that back to the server along with the calculated text statistics

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    print(request.args.get("file"))
    text_contents = extract_file_contents(request.args.get("file"))
    text_statistics = calculate_text_statistics(text_contents)
    summarized_text = ""
    for text in text_contents:
        summarized_text += create_summary(" ".join(text_contents[text])) + " "
    summarized_text = summarized_text.strip()
    return jsonify({"text": summarized_text, "statistics": text_statistics})

# Endpoint for fetching all the files uploaded by the current user. Need to eventually transition to having user accounts and fetching files from a database instead of locally

@app.route("/fetch_files", methods = ["GET"])
def get_files():
    return jsonify({"files": os.listdir("../uploads")})

# Endpoint to handle the task of answering questions about a specific document the user chooses

@app.route("/get_model_response", methods = ["GET"])
def fetch_response():
    query = request.args.get("query")
    text_contents = extract_file_contents(request.args.get("file"))
    extracted_text = ""
    for content in text_contents:
        extracted_text += " ".join(text_contents[content])
    response = answer_questions(extracted_text, query)
    return jsonify({"response": response})

# Endpoint to handle the task of generating questions of specific types on a specific document the user chooses

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    question_types = request.args.get("questionTypes") # array of all the selected options
    print(question_types)
    filename = request.args.get("file")
    text_contents = extract_file_contents(filename)
    extracted_text = ""
    for content in text_contents:
        extracted_text += " ".join(text_contents[content])
    response = generate_questions(extracted_text, question_types)

    if not os.path.exists("../generatedQuestions"):
        os.makedirs("../generatedQuestions")
    
    doc = fitz.open()
    page = doc._newPage(width=600, height=845)
    where = fitz.Point(45, 100)
    page.insert_text(where, response, fontsize=8)
    doc.save(f"../generatedQuestions/{filename[:len(filename) - 4]}-generatedQuestions.pdf")

    return jsonify({"status": "PDF Generated Successfully"})

if __name__ == "__main__":
    app.run(debug = True)