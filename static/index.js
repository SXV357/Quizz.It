document.addEventListener("DOMContentLoaded", function() {
    var file_upload_status = document.querySelector(".file_upload_status");
    var file_input = document.querySelector("#upload");
    var upload_form = document.querySelector("#uploadForm");
    var summary_button = document.querySelector(".summary_button"); // both on the main page
    var questions_button = document.querySelector(".questions_button"); // both on the main page

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
        window.location.href = "/fetch_summarize_files";
    });

    questions_button.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/fetch_questions_files"; // this renders questions.html
    });

});