import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import "./chatbot.css"

export default function Chatbot() {

  const [query, setQuery] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state;

  useEffect(() => {
    sessionStorage.removeItem("history")
    sessionStorage.removeItem("usedTokens")
  }, [])

  const fetchAnswer = (e) => {
    e.preventDefault();

    if (query.trim() === "") return;

    const sessionHistory = sessionStorage.getItem("history");
    let userMessages = sessionHistory? JSON.parse(sessionHistory)["user"] : []
    let botResponses = sessionHistory ? JSON.parse(sessionHistory)["bot"] : [];
    let localHistory = {user: userMessages, bot: botResponses};

    const usedTokens = sessionStorage.getItem("usedTokens");
    let localUsedTokens = usedTokens ? JSON.parse(usedTokens) : 0;

    const conversation = document.getElementById("conversationContainer");

    let userElem = document.createElement("div")
    userElem.className = "message user-message"
    userElem.innerHTML = query
    conversation.appendChild(userElem);

    setIsDisabled(true)
    fetch (`http://127.0.0.1:5000/get_model_response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        query: query,
        history: localHistory,
        usedTokens: localUsedTokens
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setQuery("");
        const response = data["response"]
        const usedTokens = data["usedTokens"]
        const updatedHistory = data["updatedHistory"];
        
        // appending bot message to conversation container
        let botElem = document.createElement("div")
        botElem.className = "message bot-message"
        botElem.innerHTML = response
        conversation.appendChild(botElem);

        if (updatedHistory) {
          localHistory = updatedHistory;
          sessionStorage.setItem("history", JSON.stringify(localHistory))
        }
        
        // updating conversation history with latest interaction
        localHistory["user"].push(query);
        localHistory["bot"].push(response);
        sessionStorage.setItem("history", JSON.stringify(localHistory))
        
        // updating number of used tokens in session storage
        sessionStorage.setItem("usedTokens", usedTokens)
      })
  }

  return (
    <>
      <button 
      style = {{position: "absolute", top: 0, left: 0, margin: "10px"}}
      onClick = {() => {
        sessionStorage.removeItem("history")
        sessionStorage.removeItem("usedTokens")
        navigate("/fetch_ask_questions_files", {state: username});
      }}
      >
      Back to file selection
      </button>
      <div id = "conversationContainer"></div>
      <div id="queryContainer">
        <input 
          placeholder = "What is your question?" 
          type = "text" 
          id="questionInput" 
          value = {query} 
          onChange = {(e) => setQuery(e.target.value)}
          disabled = {isDisabled}
        />
        <button 
          type="button" 
          id="getResponseButton" 
          onClick = {(e) => fetchAnswer(e)}
          disabled = {isDisabled}
        >
        Submit Query
        </button>
    </div>
    </>
  )
}