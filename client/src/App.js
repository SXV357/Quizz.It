import React, {useState} from "react";

export default function App() {

  const [fileUploadStatus, setFileUploadStatus] = useState("");
  const [summaryFileStatus, setSummaryFileStatus] = useState("");
  const [generateQuestionFileStatus, setGenerateQuestionFileStatus] = useState("");
  const [askQuestionFileStatus, setAskQuestionFileStatus] = useState("");

  const determine_route = (e, page) => {
    // on the backend the logic will be implemented such that the number of uploaded documents for this user will be fetched and depending on that a status message will be updated
    e.preventDefault();
    fetch("http://127.0.0.1:5000/check_files")
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
            <input type="submit" value="Upload" id="uploadButton" className="upload__button" />
          </form>
          <div className="file_upload_status">{fileUploadStatus}</div>
        </section>
      </div>

      <div class="options" id="options">
        <h1>Choose Your Direction</h1>
        <div class="options__wrapper">
            <div class="options__card">
                <h2>Document too long?</h2>
                <p>We got your back!</p>
                <div class="summary_button"><button onClick = {(e) => determine_route(e, "summary")}>Generate Summary</button></div>
                <div class="summaryFilesStatus"></div>
            </div>
            <div class="options__card">
                <h2>Studying for a test?</h2>
                <p>We can quiz you!</p>
                <div class="questions_button"><button onClick = {(e) => determine_route(e, "generate_questions")}>Generate Test Questions</button></div>
                <div class="generateQuestionFilesStatus"></div>
            </div>
            <div class="options__card">
                <h2>Have questions about the document?</h2>
                <p>We can help you with that</p>
                <div class="ask_question_button"><button onClick = {(e) => determine_route(e, "ask_questions")}>Ask a Question</button></div>
                <div class="askQuestionFilesStatus"></div>
            </div>
        </div>
    </div>
    </>
  );
}