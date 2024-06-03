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

  return (
    <div id="container">
        <h2>Question Creator</h2>
        <form id="questionForm">
            <label for="questionType">Select Question Type:</label>
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

            <button type="button" id="generateQuestionsButton">Generate Questions</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          window.location.href = "/";
        }}>Go To Home Page</button>
        <div className = "generatePDFStatus"></div>
    </div>
  )
}
