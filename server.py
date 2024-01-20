from flask import Flask, render_template, jsonify, request
from ocr import *

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
                file.save("uploads/", file.filename)
                return jsonify({"Status": "File uploaded successfully"})
            else:
                return jsonify({"Status": "Make sure you upload a PDF file only!"})
    return jsonify({"Status": "Make sure you have provided a file"})

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    # the text statistics are also returned as part of this
    raise NotImplementedError

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    raise NotImplementedError

if __name__ == "__main__":
    app.run(debug = True)