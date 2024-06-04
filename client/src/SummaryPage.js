import React from 'react'
import { useLocation } from 'react-router-dom';
import "./styles/summary.css"

export default function SummaryPage() {
    const location = useLocation();
    // destructing the props data passed in directly via the navigate instance
    const {text, statistics} = location.state;

    return (
        <>
            <section id="summarizeSection">
            <div className="summary">
                <h2>Here is a summary of your document:</h2>
                <p className = "summary_text">{text}</p>
            </div>

            <div className="stats">
                <h2>Here are some statistics about your document:</h2>
            <ul>
                <li>Number of words: {statistics["Number of words"]}</li>
                <li>Average word length: {statistics["Average word length"]}</li>
                <li>Number of characters: {statistics["Number of characters"]}</li>
                <li>Number of sentences: {statistics["Number of sentences"]}</li>
                <li>Number of syllables: {statistics["Number of syllables"]}</li>
                <li>Legibility index: {statistics["Legibility index"]}</li>
            </ul>
            </div>
            <button className = "toHomePage" type = "button" onClick = {(e) => {
                e.preventDefault();
                window.location.href = "/";
            }}>Go to Home Page</button>
        </section>
        </>
    )
}