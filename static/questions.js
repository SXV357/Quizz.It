document.addEventListener("DOMContentLoaded", function() {
    var generate_questions_button = document.querySelector("#generateQuestionsButton") // on the generate questions page
    var questionType = document.getElementById("questionType");
    var fileType = document.getElementById("questionFileSelect");
    var pdfGenerationStatus = document.querySelector(".generatePDFStatus");

    generate_questions_button.addEventListener("click", (e) => {
        e.preventDefault();
        const questionTypes = Array.from(questionType.options).filter(option => option.selected).map(option => option.value); // gets the whole array
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
        if (questionTypes.length === 0) {
            pdfGenerationStatus.innerHTML = "You need to select atleast one question type!";
            return;
        }
        pdfGenerationStatus.innerHTML = "Please wait as the questions are being generated...";
        fetch(`http://127.0.0.1:5000/generate_pdf?questionTypes=${questionTypes}&file=${selectedFile}`, {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            pdfGenerationStatus.innerHTML = data.status;
        })
    })
})