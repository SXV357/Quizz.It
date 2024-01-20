from flask import Flask, render_template, jsonify, request
from ocr import *
import os

app = Flask(__name__, static_url_path='/static')

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
            if file.filename.split(".")[1] == "pdf":
                if not os.path.exists("uploads"):
                    os.makedirs("uploads")
                file.save(os.path.join("uploads", file.filename))
                return jsonify({"status": "File uploaded successfully"})
            else:
                return jsonify({"status": "Make sure you upload a PDF file only!"})
    return jsonify({"status": "Make sure you have provided a file"})

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    target_file = os.listdir("uploads")[0]
    pdf_images = convert_to_image(os.path.join("uploads", target_file))
    text_contents = process_pdf_page(pdf_images)
    # run this through the ML model
    text_statistics = calculate_text_statistics(text_contents)
    return render_template("summarize_text.html", summarized_text = "", statistics = text_statistics)

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    target_file = os.listdir("uploads")[0]
    pdf_images = convert_to_image(os.path.join("uploads", target_file))
    text_contents = process_pdf_page(pdf_images)
    # run this through the ML model and then provide the questions
    raise NotImplementedError

if __name__ == "__main__":
    app.run(debug = True)