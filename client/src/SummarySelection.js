import React, {useState, useEffect} from 'react'

export default function SummarySelection() {

    const [summarizeFiles, setSummarizeFiles] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:5000/fetch_files", {
            method: "GET"
        })
         .then(res => res.json())
         .then(data => setSummarizeFiles(data.files))
    }, [])

    // const summarize = () => {

    // }

  return (
    <div id="container">
        <h2>Selection</h2>
        <form id="questionForm">
            <label htmlFor="summarizeFileSelect">Select a File That You Would Like to Summarize:</label>
            <select id="summarizeFileSelect" name="summarizeFileSelect" multiple>
                {summarizeFiles.map((file, idx) => {
                    return <option key = {idx} value = {file}>{file}</option>
                })}
                {/* {% for file in files %}
                    <option value="{{ file }}">{{ file }}</option>
                {% endfor %} */}
            </select>

            <button type="button" id="summarizeFileButton">Summarize This File</button>
        </form>
        <button className = "toHomePage" type = "button">Go to Home Page</button>
        <div className = "summarizeFileStatus"></div>
    </div>
  )
}