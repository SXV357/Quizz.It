from flask import Flask, render_template, jsonify
from ocr import *

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def display_opening():
    return render_template("index.html")

@app.route("/generate_summary", methods = ["GET"])
def return_generated_text():
    raise NotImplementedError

@app.route("/generate_pdf", methods = ["GET"])
def generate_questions_pdf():
    raise NotImplementedError

@app.route("/generate_statistics", methods = ["GET"])
def generate_statistics():
    raise NotImplementedError

if __name__ == "__main__":
    app.run(debug = True)