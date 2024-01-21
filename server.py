import fitz
from flask import Flask, render_template, jsonify, request
from ocr import *
import os
from summary import create_summary
from gpt import *
from question_answering import generate_answer

app = Flask(__name__, static_url_path='/static')

def extract_file_contents(file_name):
    target_file = os.path.join("uploads", file_name)
    pdf_images = convert_to_image(target_file)
    text_contents = process_pdf_page(pdf_images) 
    return text_contents

@app.route("/")
def display_opening():
    return render_template("index.html")

@app.route("/<string:file_name>")
def display_page(file_name: str = None):
    return render_template(f'{file_name}')

@app.route("/check_files", methods = ["GET"])
def return_file_count():
    files = os.listdir("uploads")
    if len(files) == 0:
        return jsonify({"filesExist": False})
    else:
        return jsonify({"filesExist": True})

@app.route("/upload_file", methods = ["POST"])
def save_uploaded_file():
    if request.method == "POST":
        if "upload" in request.files: # upload(for attribute of label tag, id and name of input tag)
            file = request.files["upload"]
            if file.filename.endswith(".pdf"):
                if not os.path.exists("uploads"):
                    os.makedirs("uploads")
                file.save(os.path.join("uploads", file.filename))
                return jsonify({"status": "File uploaded successfully"})
            else:
                return jsonify({"status": "Make sure you upload a PDF file only!"})
    return jsonify({"status": "Make sure you have provided a file"})

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    text_contents = extract_file_contents(request.args.get("file"))
    text_statistics = calculate_text_statistics(text_contents)
    summarized_text = ""
    for text in text_contents:
        summarized_text += create_summary(" ".join(text_contents[text])) + " "
    summarized_text = summarized_text.strip()
    return render_template("summarize_text.html", summarized_text=summarized_text, statistics= text_statistics)

@app.route("/fetch_summarize_files", methods = ["GET"])
def return_summary_files():
    files = os.listdir("uploads")
    return render_template("summarize_text_file_select.html", files = files)

@app.route("/fetch_questions_files", methods = ["GET"])
def return_question_files():
    files = os.listdir("uploads")
    return render_template("questions.html", files = files)

@app.route("/fetch_ask_questions_files", methods = ["GET"])
def return_ask_question_files():
    files = os.listdir("uploads")
    return render_template("ask_questions.html", files = files)

@app.route("/get_model_response", methods = ["GET"])
def fetch_response():
    query = request.args.get("query")
    text_contents = extract_file_contents(request.args.get("file"))
    extracted_text = ""
    for content in text_contents:
        extracted_text += " ".join(text_contents[content])
    long_response = answer_questions(extracted_text, query) # openAI
    short_response = generate_answer(extracted_text, query)
    return jsonify({"long_response": long_response, "short_response": short_response})

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

    if not os.path.exists("generatedQuestions"):
        os.makedirs("generatedQuestions")
    
    doc = fitz.open()
    page = doc._newPage(width=600, height=845)
    where = fitz.Point(45, 100)
    page.insert_text(where, response, fontsize=8)
    doc.save(f"generatedQuestions/{filename[:len(filename) - 4]}-generatedQuestions.pdf")

    return jsonify({"status": "PDF Generated Successfully"})

if __name__ == "__main__":
    app.run(debug = True)