import React, {useState, useEffect} from 'react'

export default function QGenerationSelection() {

  const [questionGenerationFiles, setQuestionGenerationFiles] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/fetch_files", {
        method: "GET"
    })
     .then(res => res.json())
     .then(data => setQuestionGenerationFiles(data.files))
  }, [])

  const generateQuestions = (e) => {
    e.preventDefault();
    let questionType = document.getElementById("questionType");
    let fileType = document.getElementById("questionFileSelect");
    let pdfGenerationStatus = document.querySelector(".generatePDFStatus");

    const questionTypes = Array.from(questionType.options).filter(option => option.selected).map(option => option.value); // gets the whole array
    const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
    if (questionTypes.length === 0) {
      pdfGenerationStatus.innerHTML = "You need to select atleast one question type!";
      return;
    }
    pdfGenerationStatus.innerHTML = "Please wait as the questions are being generated...";
    fetch(`http://127.0.0.1:5000/generate_pdf?questionTypes=${questionTypes}&file=${selectedFile}`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
          pdfGenerationStatus.innerHTML = data.status;
      })
      .catch((err) => pdfGenerationStatus.innerHTML = "An error occurred when generating the PDF. Please try again");
  }

  return (
    <div id="container">
        <h2>Question Creator</h2>
        <form id="questionForm">
            <label htmlFor="questionType">Select Question Type:</label>
            <select id="questionType" name="questionType" multiple>
                <option value="multipleChoice">Multiple Choice</option>
                <option value="shortAnswer">Short Answer</option>
                <option value="trueAndFalse">True and False</option>
            </select>

            <label htmlFor="questionFileSelect">Choose a file to generate questions based off of:</label>
            <select id="questionFileSelect" name="questionFileSelect">
                {questionGenerationFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>

            <button type="button" id="generateQuestionsButton" onClick = {(e) => generateQuestions(e)}>Generate Questions</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          window.location.href = "/";
        }}>Go To Home Page</button>
        <div className = "generatePDFStatus"></div>
    </div>
  )
}
