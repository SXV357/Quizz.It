from flask import Flask, render_template, jsonify, request
from ocr import *
import os

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
    # run this through the ML model and pass it as a param to summarized_text
    text_statistics = calculate_text_statistics(text_contents)
    return render_template("summarize_text.html", summarized_text=text_contents, statistics= text_statistics)

@app.route("/fetch_summarize_files", methods = ["GET"])
def return_summary_files():
    files = os.listdir("uploads")
    return render_template("summarize_text_file_select.html", files = files)

@app.route("/fetch_questions_files", methods = ["GET"])
def return_question_files():
    files = os.listdir("uploads")
    return render_template("questions.html", files = files)

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    question_types = request.args.get("questionTypes") # array of all the selected options
    text_contents = extract_file_contents(request.args.get("file"))
    # run this through the ML model and then construct a prompt to provide to the model
    # then write contents to a pdf file and save it
    return jsonify({"status": "PDF Generated Successfully"})

if __name__ == "__main__":
    app.run(debug = True)