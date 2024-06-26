import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function QAnsweringSelection() {

  const [questionAnsweringFiles, setQuestionAnsweringFiles] = useState([])
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state;

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
        method: "GET"
    })
     .then(res => res.json())
     .then(data => setQuestionAnsweringFiles(data.files))
  }, [])

  const getAnswer = (e) => {
    e.preventDefault();
    let fileType = document.getElementById("askQuestionFileSelect");
    let inputField = document.getElementById("questionInput");
    let responseField = document.querySelector(".askQuestionResponse");

    const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
    if (selectedFile === undefined) {
      responseField.innerHTML = "You need to select a file!";
      return;
    } else if (inputField.value === "") {
        responseField.innerHTML = "Make sure you enter a valid query!";
        return;
    }
    responseField.innerHTML = "Waiting on a response..."
    fetch (`http://127.0.0.1:5000/get_model_response?query=${inputField.value}&file=${selectedFile}`, {
        method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data["response"]);
        responseField.innerHTML = data["response"];
      })
  }

  return (
    <div id="container">
        <form id="questionForm">
            <label htmlFor="askQuestionFileSelect">Select a file that you would like to ask questions about</label>
            <select id="askQuestionFileSelect" name="askQuestionFileSelect">
                {questionAnsweringFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>
            <input placeholder = "What is your question?" type = "text" id="questionInput" />

            <button type="button" id="getResponseButton" onClick = {() => console.log("submit query")}>Submit Query</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          navigate("/app", {state: username});
        }}>Go To Home Page</button>
        <div className = "askQuestionResponse"></div>
    </div>
  )
}