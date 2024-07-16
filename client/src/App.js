import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {auth, storage} from "./firebase"
import { signOut } from "firebase/auth";
import {ref, uploadBytes} from "firebase/storage"

export default function App() {

  const [fileUploadStatus, setFileUploadStatus] = useState("");
  const [summaryFileStatus, setSummaryFileStatus] = useState("");
  const [generateQuestionFileStatus, setGenerateQuestionFileStatus] = useState("");
  const [askQuestionFileStatus, setAskQuestionFileStatus] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state;

  async function logOut(e) {
    e.preventDefault();
    // sign user out and redirect them back to the login page
    await signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
        navigate("/login");
      })
      .catch(err => console.log(err));
  }

  // async function uploadFileToStorage(fileName, uploadFile) {
  //   const fileStorage = ref(storage, `${username}/${fileName}`)
  //   await uploadBytes(fileStorage, uploadFile)
  //     .then((snapshot) => {
  //       console.log(snapshot);
  //       setFileUploadStatus("File uploaded successfully");
  //     })
  // }

  // will make a post request to the backend sendint the file and then retrieve a pdf version of the file to be uploaded to firebase storage
  const uploadFile = async (e) => {
    e.preventDefault();
    setSummaryFileStatus("");
    setGenerateQuestionFileStatus("");
    setAskQuestionFileStatus("");
    let file_input = document.querySelector("#upload");
    let formData = new FormData();
    if (!(file_input.files[0] === undefined)) {
      let file = file_input.files[0];
      // in case the file upload takes a long time
      setFileUploadStatus("Upload in progress...");
      formData.append("upload", file);
      fetch(`http://127.0.0.1:5000/upload_file?username=${username}`, {
          method: "POST",
          body: formData
      })
        .then(res => res.json())
        .then(data => {
          setFileUploadStatus(data.status);
        })
      // let fileName = file_input.files[0].name;
      // console.log(`Original file name: ${fileName}`)
      // if (res.headers.get('content-type') === 'application/json') {
      //   return res.json().then((data) => {
      //     if (data.status === "PDF OK") {
      //       console.log("Uploaded file is a PDF file and it passed all checks");
      //       uploadFileToStorage(fileName, file_input.files[0]);
      //     } else {
      //       setFileUploadStatus(data.status);
      //     }
      //   }).catch((e) => console.log(`Error: ${e}`))
      // } 
      // else {
      //   return res.blob().then((blob) => {
      //     console.log(`blob: ${typeof blob}`)
      //     console.log(blob)
      //     // console.log(`received file from the backend: ${blob} `)
      //     fileName = fileName.substring(0, fileName.lastIndexOf(".")) + ".pdf";
      //     uploadFileToStorage(fileName, blob);
      //   }).catch((e) => console.log(`Error: ${e}`))
      // }
    } else {
      setFileUploadStatus("Make sure you have provided a file");
    }
  }

  const determine_route = (e, page) => {
    // on the backend the logic will be implemented such that the number of uploaded documents for this user will be fetched and depending on that a status message will be updated
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/check_files?username=${username}`, {
        method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (data.filesExist) {
          switch (page) {
            case "summary": navigate("/fetch_summarize_files", {state: username}); break;
            case "questionGeneration": navigate("/fetch_questions_files", {state: username}); break;
            case "chatbot": navigate("/fetch_ask_questions_files", {state: username}); break;
          }
        }
        else {
          switch (page) {
            case "summary": setSummaryFileStatus("You haven't uploaded any files yet!"); break;
            case "questionGeneration": setGenerateQuestionFileStatus("You haven't uploaded any files yet!"); break;
            case "chatbot": setAskQuestionFileStatus("You haven't uploaded any files yet!"); break;
          }
        }
      })
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <a href="#home" id="navbar__logo">QuizzIt</a>
          <button onClick = {(e) => logOut(e)}>Sign Out</button>
          <button onClick = {() => navigate("/forgot_password")}>Forgot Password?</button>
          <div className="navbar__toggle" id="mobile-menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      <div className="intro" id="home">
        <div className="intro__container">
          <h1 className="intro__heading">Welcome to <span>QuizzIt</span> {username}</h1>
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
                <div className="questions_button"><button onClick = {(e) => determine_route(e, "questionGeneration")}>Generate Test Questions</button></div>
                <div className="generateQuestionFilesStatus">{generateQuestionFileStatus}</div>
            </div>
            <div className="options__card">
                <h2>Have questions about the document?</h2>
                <p>We can help you with that</p>
                <div className="ask_question_button"><button onClick = {(e) => determine_route(e, "chatbot")}>Ask a Question</button></div>
                <div className="askQuestionFilesStatus">{askQuestionFileStatus}</div>
            </div>
        </div>
    </div>
    </>
  );
}