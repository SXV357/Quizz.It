import React from 'react'
import {useNavigate} from "react-router-dom"

export default function Landing() {
    const navigate = useNavigate();
  return (
    <>
        <div className = "nav-bar"></div>
        <div className = "hero">
            <h1>Quizz.It</h1>
            <p>A productivity platform leveraging AI to streamline your most common educational needs</p>
            <div className = "action-buttons">
                <button onClick = {() => navigate("/login")}>Log In</button>
                <button onClick = {() => navigate("/sign_up")}>Sign Up</button>
            </div>
        </div>
        <div className = "features">
            <section>Summarize Documents</section>
            <section>Generate Test Questions on any document of your choosing</section>
            <section>Get questions answered on any document of your choosing</section>
        </div>
    </>
  )
}
