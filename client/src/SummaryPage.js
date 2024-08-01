import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';    
import "./styles/summary.css"

export default function SummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const {summarized_text, statistics, username} = location.state;

    return (
        <>
            <section id="summarizeSection">
            <div className="summary">
                <h2>Here is a summary of your document:</h2>
                <div>
                    <div className = "summary_text">
                        {summarized_text.map((pair, idx) => {
                            return (
                                <section key = {idx}>
                                    <p>Summary for {pair[0]}</p><br />
                                    <p>{pair[1]}</p><br />
                                </section>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="stats">
                <h2>Here are some statistics about your document:</h2>
            <ul>
                {Object.entries(statistics).map((pair, idx) => {
                    return <li key = {idx}>{pair[0]}: {pair[1]}</li>
                })}
            </ul>
            </div>
            <button className = "toHomePage" type = "button" onClick = {(e) => {
                e.preventDefault();
                navigate("/app", {state: username})
            }}>Go to Home Page</button>
        </section>
        </>
    )
}