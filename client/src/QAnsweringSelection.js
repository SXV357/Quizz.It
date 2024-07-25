import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function QAnsweringSelection() {

  const [questionAnsweringFiles, setQuestionAnsweringFiles] = useState([])
  const [query, setQuery] = useState("")
  const [questionAnswerStatus, setQuestionAnswerStatus] = useState("")

  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state;

  useEffect(() => {
    sessionStorage.removeItem("history");
    document.querySelector(".conversation").innerHTML = "";
    fetch(`http://127.0.0.1:5000/fetch_files?username=${username}`, {
        method: "GET"
    })
     .then(res => res.json())
     .then(data => setQuestionAnsweringFiles(data.files))
  }, [])

  const getAnswer = (e) => {
    e.preventDefault();
    let fileType = document.getElementById("askQuestionFileSelect");
    let conversation = document.querySelector(".conversation");

    const sessionHistory = sessionStorage.getItem("history");
    let userMessages = sessionHistory !== null ? JSON.parse(sessionHistory)["user"] : []
    let botResponses = sessionHistory !== null ? JSON.parse(sessionHistory)["bot"] : [];
    let localHistory = {user: userMessages, bot: botResponses};

    const usedTokens = sessionStorage.getItem("usedTokens");
    let localUsedTokens = usedTokens !== null ? JSON.parse(usedTokens) : 0;

    const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
    if (selectedFile === undefined) {
      setQuestionAnswerStatus("You need to select a file!");
      return;
    } else if (query === "") {
        setQuestionAnswerStatus("Make sure you enter a valid query!");
        return;
    }
    let userElem = document.createElement("div")
    userElem.className = "userQuery"
    userElem.innerHTML = `User: ${query}`
    conversation.appendChild(userElem);

    setQuestionAnswerStatus("Waiting on a response...");
    fetch (`http://127.0.0.1:5000/get_model_response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          query: query,
          file: selectedFile,
          username: username,
          history: localHistory,
          usedTokens: localUsedTokens
        })
    })
      .then((res) => res.json())
      .then((data) => {
        const response = data["response"]

        let botElem = document.createElement("div")
        botElem.className = "botResponse"
        botElem.innerHTML = `Bot: ${response}`
        conversation.appendChild(botElem);

        localHistory["user"].push(query);
        localHistory["bot"].push(response);
        sessionStorage.setItem("history", JSON.stringify(localHistory))

        setQuery("");
        setQuestionAnswerStatus("");
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
            <input placeholder = "What is your question?" type = "text" id="questionInput" value = {query} onChange = {(e) => setQuery(e.target.value)}/>

            <button type="button" id="getResponseButton" onClick = {(e) => getAnswer(e)}>Submit Query</button>
        </form>
        <button className = "toHomePage" type = "button" onClick = {(e) => {
          e.preventDefault();
          sessionStorage.removeItem("history");
          navigate("/app", {state: username});
        }}>Go To Home Page</button>
        <div className = "questionAnswerStatus">{questionAnswerStatus}</div>
    </div>
    <div className = "conversation"></div>
    </>
  )
}