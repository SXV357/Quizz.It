import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import "./styles/generation.css"
import "./styles/selection.css"

export default function QGenerationSelection() {

  const [questionGenerationFiles, setQuestionGenerationFiles] = useState([])
  const [generatePDFStatus, setGeneratePDFStatus] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state;

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
        method: "GET"
    })
     .then(res => res.json())
     .then(data => setQuestionGenerationFiles(data.files))
  }, [])

  const generateQuestions = (e) => {
    e.preventDefault();
    let questionType = document.getElementById("questionType");
    let fileType = document.getElementById("questionFileSelect");
    let fileDownload = document.getElementById("questionsDownload")

    const questionTypes = Array.from(questionType.options).filter(option => option.selected).map(option => option.value);
    const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];

    if (questionTypes.length === 0) {
      setGeneratePDFStatus("You need to select atleast one question type!");
      return;
    }

    setIsDisabled(true)
    setGeneratePDFStatus("Please wait as the questions are being generated...");

    fetch(`http://127.0.0.1:5000/generate_pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        questionTypes: questionTypes,
        file: selectedFile,
        username: username
      })
    })
      .then((res) => res.blob())
      .then(blob => {
          fileDownload.style.display = "block";
          fileDownload.href = URL.createObjectURL(blob);
          fileDownload.download = selectedFile.substring(0, selectedFile.lastIndexOf(".")) + "-generatedQuestions.pdf";

          setIsDisabled(false);
          setGeneratePDFStatus("Questions generated successfully!")
      })
      .then((err) => console.log(err))
  }

  return (
    <>
      <div id="container">
        <h2>Question Generation Document Selection</h2>
        <form id="questionForm">
            <label htmlFor="questionType">Select Question Type:</label>
            <select id="questionType" name="questionType" multiple disabled = {isDisabled}>
                <option value="multipleChoice">Multiple Choice</option>
                <option value="shortAnswer">Short Answer</option>
                <option value="trueAndFalse">True and False</option>
            </select>

            <label htmlFor="questionFileSelect">Choose a file to generate questions based off of:</label>
            <select id="questionFileSelect" name="questionFileSelect" disabled = {isDisabled}>
                {questionGenerationFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>

            <button 
              type="button" 
              disabled = {isDisabled} 
              id="btn" 
              onClick = {(e) => generateQuestions(e)}
            >
            Generate Questions
            </button>
        </form>
        <button 
          id = "toHomePage" 
          disabled = {isDisabled} 
          type = "button" 
          onClick = {(e) => {
          e.preventDefault();
          navigate("/app", {state: username});
          }}>
        Go To Home Page
        </button>
        <div className = "status">{generatePDFStatus}</div>
      </div>
      <a href = "#" id = "questionsDownload" style = {{display: "none", margin: "0 auto", textAlign: "center"}} download>
        <FontAwesomeIcon icon={faFilePdf} size = {"4x"}/>
      </a>
    </>
  )
}