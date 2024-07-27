import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function QAnsweringSelection() {

  const [questionAnsweringFiles, setQuestionAnsweringFiles] = useState([])
  const [qaFileSelectionStatus, setQaFileSelectionStatus] = useState("")

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

  const selectFile = (e) => {
    e.preventDefault();
    let fileType = document.getElementById("askQuestionFileSelect");

    const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
    if (selectedFile === undefined) {
      setQaFileSelectionStatus("You need to select a file!");
      return;
    }

    setQaFileSelectionStatus("Please wait as the document is being processed...")
    fetch(`http://127.0.0.1:5000/signal_doc_qa_selection?file=${selectedFile}&username=${username}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK") {
          setQaFileSelectionStatus("")
          navigate("/chatbot_page", {state: username})
        }
      })
  }

  return (
    <>
      <div id="container">
        <form id="questionForm">
            <label htmlFor="askQuestionFileSelect">Select a file that you would like to ask questions about</label>
            <select id="askQuestionFileSelect" name="askQuestionFileSelect">
                {questionAnsweringFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>
            <button type="button" id="selectFileButton" onClick = {(e) => selectFile(e)}>Chat about this file</button>
        </form> 
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          navigate("/app", {state: username});
        }}>Go To Home Page</button>
        <div className = "qaFileSelectionStatus" style = {{textAlign: "center"}}>{qaFileSelectionStatus}</div>
    </div>
    </>
  )
}