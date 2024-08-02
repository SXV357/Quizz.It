import React from 'react'
import {useNavigate} from "react-router-dom"
import "./styles/landing.css"
import chatbot from "./images/chatbot.jpg"
import summarization from "./images/summarization.jpg"
import questionGeneration from "./images/question-generation.jpg"

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
        <div className = "hero">
            <h1>Quizz.It</h1>
            <p>A productivity platform leveraging AI to streamline your most common educational needs</p>
            <div className = "action-buttons">
                <button className = "auth-btn" onClick = {() => navigate("/login")}>Log In</button>
                <button className = "auth-btn" onClick = {() => navigate("/sign_up")}>Sign Up</button>
            </div>
        </div>
        <div className = "features">
            <section className = "feature-section">
                <div className="feature-content">
                    <h2>Summarize Documents</h2>
                    <p className="feature-description">
                        Quickly generate concise summaries for lengthy documents with our AI-powered page-by-page analysis. Enhance your understanding and save time with tailored summaries that highlight key points.
                    </p>
                </div>
                <img className = "feature-img" src = {summarization}></img>
            </section>
            <section className = "feature-section">
                <div className="feature-content">
                    <h2>Generate Study Questions</h2>
                    <p className="feature-description">
                        Transform documents into valuable study materials by generating relevant test questions.
                        Use these questions to prepare effectively for quizzes and exams, ensuring you're ready for any challenge.
                    </p>
                </div>
                <img className = "feature-img" src = {questionGeneration}></img>
            </section>
            <section className = "feature-section">
                <div className="feature-content">
                    <h2>Document Q&A Chatbot</h2>
                    <p className="feature-description">
                        Interact with our intelligent chatbot to get answers from any document you upload.
                        Instantly clarify doubts and enhance your learning experience with this powerful Q&A tool.
                    </p>
                </div>
                <img className = "feature-img" src = {chatbot}></img>
            </section>
        </div>
    </>
  )
}