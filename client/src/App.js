import React, {useState} from "react";

export default function App() {

  const [fileUploadStatus, setFileUploadStatus] = useState("");
  const [summaryFileStatus, setSummaryFileStatus] = useState("");
  const [generateQuestionFileStatus, setGenerateQuestionFileStatus] = useState("");
  const [askQuestionFileStatus, setAskQuestionFileStatus] = useState("");

  const uploadFile = (e) => {
    e.preventDefault();
    setSummaryFileStatus("");
    setGenerateQuestionFileStatus("");
    setAskQuestionFileStatus("");
    let file_input = document.querySelector("#upload");
    let formData = new FormData();
    if (!(file_input.files[0] === undefined)) {
      // in case the file upload takes a long time
      setFileUploadStatus("Upload in progress...");
      formData.append("upload", file_input.files[0]);
      fetch("http://127.0.0.1:5000/upload_file", {
          method: "POST",
          body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          setFileUploadStatus(data.status);
        })
    } else {
      setFileUploadStatus("Make sure you have provided a file");
    }
  }

  const determine_route = (e, page) => {
    // on the backend the logic will be implemented such that the number of uploaded documents for this user will be fetched and depending on that a status message will be updated
    e.preventDefault();
    fetch("http://127.0.0.1:5000/check_files", {
        method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (data.filesExist) {
          switch (page) {
            case "summary": window.location.href = "/fetch_summarize_files"; break;
            case "generate_questions": window.location.href = "/fetch_questions_files"; break;
            case "ask_questions": window.location.href = "/fetch_ask_questions_files"; break;
          }
        }
        else {
          switch (page) {
            case "summary": setSummaryFileStatus("You haven't uploaded any files yet!"); break;
            case "generate_questions": setGenerateQuestionFileStatus("You haven't uploaded any files yet!"); break;
            case "ask_questions": setAskQuestionFileStatus("You haven't uploaded any files yet!"); break;
          }
        }
      })
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <a href="#home" id="navbar__logo">QuizzIt</a>
          <div className="navbar__toggle" id="mobile-menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      <div className="intro" id="home">
        <div className="intro__container">
          <h1 className="intro__heading">Welcome to <span>QuizzIt</span></h1>
          <p className="intro__description">Please Upload Your File Below</p>
        </div>
        <section className="intro__section">
          <form id="uploadForm" method="post" encType="multipart/form-data" action="">
            <input type="file" id="upload" name="upload" className="select__button" />
            <br />
            <input type="submit" value="Upload" id="uploadButton" className="upload__button" onClick = {(e) => uploadFile(e)}/>
          </form>
          <div className="file_upload_status">{fileUploadStatus}</div>
        </section>
      </div>

      <div className="options" id="options">
        <h1>Choose Your Direction</h1>
        <div className="options__wrapper">
            <div className="options__card">
                <h2>Document too long?</h2>
                <p>We got your back!</p>
                <div className="summary_button"><button onClick = {(e) => determine_route(e, "summary")}>Generate Summary</button></div>
                <div className="summaryFilesStatus">{summaryFileStatus}</div>
            </div>
            <div className="options__card">
                <h2>Studying for a test?</h2>
                <p>We can quiz you!</p>
                <div className="questions_button"><button onClick = {(e) => determine_route(e, "generate_questions")}>Generate Test Questions</button></div>
                <div className="generateQuestionFilesStatus">{generateQuestionFileStatus}</div>
            </div>
            <div className="options__card">
                <h2>Have questions about the document?</h2>
                <p>We can help you with that</p>
                <div className="ask_question_button"><button onClick = {(e) => determine_route(e, "ask_questions")}>Ask a Question</button></div>
                <div className="askQuestionFilesStatus">{askQuestionFileStatus}</div>
            </div>
        </div>
    </div>
    </>
  );
}