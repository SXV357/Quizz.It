import React, {useState, useEffect} from 'react'

export default function QAnsweringSelection() {

  const [questionAnsweringFiles, setQuestionAnsweringFiles] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/fetch_files", {
        method: "GET"
    })
     .then(res => res.json())
     .then(data => setQuestionAnsweringFiles(data.files))
  }, [])

  return (
    <div id="container">
        <form id="questionForm">
            <label htmlFor="askQuestionFileSelect">Select a file that you would like to ask questions about</label>
            <select id="askQuestionFileSelect" name="askQuestionFileSelect" multiple>
                {questionAnsweringFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>
            <input placeholder = "What is your question?" type = "text" id="questionInput" />

            <button type="button" id="getResponseButton">Submit Query</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          window.location.href = "/";
        }}>Go To Home Page</button>
        <div className = "askQuestionResponse"></div>
    </div>
  )
}