document.addEventListener("DOMContentLoaded", function() {
    var generate_questions_button = document.querySelector("#processButton") // on the generate questions page
    var questionType = document.getElementById("questionType");
    
    console.log(generate_questions_button);
    generate_questions_button.addEventListener("click", (e) => {
        const selectedValues = Array.from(questionType.options).filter(option => option.selected).map(option => option.value);
        fetch(`http://127.0.0.1:5000/generate_summary?options=${selectedValues}`, {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("PDF generated successfully!");
        })
    })
})