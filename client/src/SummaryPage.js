import React from 'react'

export default function SummaryPage({summarized_text, num_words, avg_length, num_chars, num_sentences, num_syllables, leg_idx}) {
  return (
    <>
        <section id="summarizeSection">
        <div class="summary">
            <h2>Here is a summary of your document:</h2>
            <p class = "summary_text">{summarized_text}</p>
        </div>

        <div class="stats">
            <h2>Here are some statistics about your document:</h2>
        <ul>
            <li>Number of words: {num_words}</li>
            <li>Average word length: {avg_length}</li>
            <li>Number of characters: {num_chars}</li>
            <li>Number of sentences: {num_sentences}</li>
            <li>Number of syllables: {num_syllables}</li>
            <li>Legibility index: {leg_idx}</li>
        </ul>
        </div>
        <button class = "toHomePage" type = "button" onClick = {(e) => {
            e.preventDefault();
            window.location.href = "/";
        }}>Go to Home Page</button>
    </section>
    </>
  )
}