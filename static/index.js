document.addEventListener("DOMContentLoaded", function() {
    var file_upload_status = document.querySelector(".file_upload_status");
    var file_input = document.querySelector("#upload");
    var upload_form = document.querySelector("#uploadForm");
    var summary_button = document.querySelector(".the_first_button");
    var questions_button = document.querySelector(".the_second_button");
    var generate_questions_button = document.querySelector("#processButton")
    var questionType = document.getElementById("questionType");

    upload_form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
        var formData = new FormData();
        formData.append("upload", file_input.files[0]);
        fetch("http://127.0.0.1:5000/upload_file", {
            method: "POST",
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            file_upload_status.innerHTML = data.status;
        })
        .catch((err) => console.log(err));
    });

    summary_button.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/generate_summary", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            window.location.href = "/templates/summarize_text.html";
        })
        .catch((err) => console.log(err));
    });

    questions_button.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/templates/questions.html";
    });

    generate_questions_button.addEventListener("click", (e) => {
        const selectedValues = Array.from(questionType.options).filter(option => option.selected).map(option => option.value);
        let options = ""
    })

});