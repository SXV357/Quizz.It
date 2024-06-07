import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import "./styles/summary.css"

export default function SummarySelection() {

    const [summarizeFiles, setSummarizeFiles] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:5000/fetch_files", {
            method: "GET"
        })
         .then(res => res.json())
         .then(data => setSummarizeFiles(data.files))
    }, [])

    const summarize = (e) => {
        e.preventDefault();
        let fileType = document.getElementById("summarizeFileSelect");
        let summarizeFileStatus = document.querySelector(".summarizeFileStatus");
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
        if (selectedFile === undefined) {
            summarizeFileStatus.innerHTML = "You need to select a file!";
            return;
        }
        summarizeFileStatus.innerHTML = "Loading...";
        try {
            // window.location.href = `/generate_summary?file=${selectedFile}`;
            fetch(`http://127.0.0.1:5000/generate_summary?file=${selectedFile}`, {
                method: "GET"
            })
             .then(res => res.json())
             .then(data => {
                // when a component that is rendered with a specific route and needs props the data can be passed using an instance of the useNavigate() hook where the route needs to be passed in along with any data
                navigate("/summary_page", {state: data})
             })
        } catch (error) {
            summarizeFileStatus.innerHTML = "An error occurred when generating the summary. Please try again";
        }
    }

  return (
    <div id="container">
        <h2>Selection</h2>
        <form id="questionForm">
            <label htmlFor="summarizeFileSelect">Select a File That You Would Like to Summarize:</label>
            <select id="summarizeFileSelect" name="summarizeFileSelect">
                {summarizeFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
            </select>
            <button type="button" id="summarizeFileButton" onClick = {(e) => summarize(e)}>Summarize This File</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          window.location.href = "/";
        }}>Go to Home Page</button>
        <div className = "summarizeFileStatus"></div>
    </div>
  )
}