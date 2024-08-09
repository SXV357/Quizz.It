import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/summary.css";
import "./styles/selection.css";

export default function SummarySelection() {
  const [summarizeFiles, setSummarizeFiles] = useState([]);
  const [summarizeFileStatus, setSummarizeFileStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState("")

  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setSummarizeFiles(data.files));
  }, []);

  const summarize = async (e) => {
    e.preventDefault();

    if (selectedFile === "") {
      setSummarizeFileStatus("You need to select a file!");
      return;
    }

    setSummarizeFileStatus("Loading...");

    try {
      fetch(
        `http://127.0.0.1:5000/generate_summary?username=${username}&file=${selectedFile}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSummarizeFileStatus("");
          navigate("/summary_page", { state: data });
        });
    } catch (error) {
      setSummarizeFileStatus(
        "An error occurred when generating the summary. Please tagain"
      );
    }
  };

  return (
    <div id="container">
      <h2>Document Summary Selection</h2>
      <form id="questionForm">
        <label htmlFor="summarizeFileSelect">
          Select a File That You Would Like to Summarize:
        </label>
        <select
          id="summarizeFileSelect"
          name="summarizeFileSelect"
          disabled={summarizeFileStatus === "Loading..."}
          value = {selectedFile}
          onChange = {(e) => setSelectedFile(e.target.value)}
          onFocus = {() => setSummarizeFileStatus("")}
        >
          <option value = "" disabled>Select a file</option>
          {summarizeFiles.map((file, idx) => {
            return (
              <option key={idx} value={file}>
                {file}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          id="btn"
          onClick={(e) => summarize(e)}
          disabled={summarizeFileStatus === "Loading..."}
        >
          Summarize This File
        </button>
      </form>
      <button
        id="toHomePage"
        disabled={summarizeFileStatus === "Loading..."}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          navigate("/app", { state: username });
        }}
      >
        Go to Home Page
      </button>
      <div className="status">{summarizeFileStatus}</div>
    </div>
  );
}