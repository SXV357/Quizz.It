import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/answering.css";
import "./styles/selection.css";

export default function QAnsweringSelection() {
  const [questionAnsweringFiles, setQuestionAnsweringFiles] = useState([]);
  const [qaFileSelectionStatus, setQaFileSelectionStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const username = sessionStorage.getItem("username");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setQuestionAnsweringFiles(data.files));
  }, []);

  const selectFile = (e) => {
    e.preventDefault();

    if (selectedFile === "") {
      setQaFileSelectionStatus("You need to select a file!");
      return;
    }

    setQaFileSelectionStatus(
      "Please wait as the document is being processed..."
    );
    setIsDisabled(true);

    fetch(
      `http://127.0.0.1:5000/signal_doc_qa_selection?file=${selectedFile}&username=${username}`,
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setIsDisabled(false);
          setQaFileSelectionStatus("");
          navigate("/chatbot_page");
        }
      });
  };

  return (
    <>
      <div id="container">
        <h2>Document Q/A File Selection</h2>
        <form id="questionForm">
          <label htmlFor="askQuestionFileSelect">
            Select a file that you would like to ask questions about
          </label>
          <select
            id="askQuestionFileSelect"
            name="askQuestionFileSelect"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            disabled={isDisabled}
            onFocus={() => setQaFileSelectionStatus("")}
          >
            <option value="" disabled>
              Select a file
            </option>
            {questionAnsweringFiles.map((file, idx) => {
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
            onClick={(e) => selectFile(e)}
            disabled={isDisabled}
          >
            Chat about this file
          </button>
        </form>
        <button
          id="toHomePage"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate("/app");
          }}
          disabled={isDisabled}
        >
          Go To Home Page
        </button>
        <div className="status" style={{ textAlign: "center" }}>
          {qaFileSelectionStatus}
        </div>
      </div>
    </>
  );
}
