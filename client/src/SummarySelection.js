import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import "./styles/summary.css"
import "./styles/selection.css"

export default function SummarySelection() {

    const [summarizeFiles, setSummarizeFiles] = useState([])
    const [summarizeFileStatus, setSummarizeFileStatus] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state;

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
            method: "GET"
        })
         .then(res => res.json())
         .then(data => setSummarizeFiles(data.files))
    }, [])

    const summarize = async (e) => {
        e.preventDefault();
        let fileType = document.getElementById("summarizeFileSelect");
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value);

        if (selectedFile[0] === undefined) {
            setSummarizeFileStatus("You need to select a file!");
            return;
        }

        setSummarizeFileStatus("Loading...");
        setIsDisabled(true);

        try {
            fetch(`http://127.0.0.1:5000/generate_summary?username=${username}&file=${selectedFile[0]}`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => {
                setIsDisabled(false);
                navigate("/summary_page", {state: data})
            })
        } catch (error) {
            setSummarizeFileStatus("An error occurred when generating the summary. Please tagain");
        }
    }

  return (
    <div id="container">
        <h2>Document Summary Selection</h2>
        <form id="questionForm">
            <label htmlFor="summarizeFileSelect">Select a File That You Would Like to Summarize:</label>
            <select id="summarizeFileSelect" name="summarizeFileSelect" disabled = {isDisabled}>
                {summarizeFiles.map((file, idx) => {
                    return <option key={idx} value={file}>{file}</option>
                })}
            </select>
            <button 
                type="button" 
                id="btn" 
                onClick={(e) => summarize(e)}
                disabled = {isDisabled}
            >
            Summarize This File
            </button>
        </form>
        <button id="toHomePage" disabled = {isDisabled} type="button" onClick={(e) => {
            e.preventDefault();
            navigate("/app", { state: username });
        }}>Go to Home Page</button>
        <div className="status">{summarizeFileStatus}</div>
    </div>
  )
}