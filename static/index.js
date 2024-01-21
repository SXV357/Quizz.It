document.addEventListener("DOMContentLoaded", function() {
    var file_upload_status = document.querySelector(".file_upload_status");
    var file_input = document.querySelector("#upload");
    var upload_form = document.querySelector("#uploadForm");
    var summary_button = document.querySelector(".summary_button"); // both on the main page
    var questions_button = document.querySelector(".questions_button"); // both on the main page
    var ask_question_button = document.querySelector(".ask_question_button");

    var summaryFiles = document.querySelector(".summaryFilesStatus");
    var genQuestionFilesStatus = document.querySelector(".generateQuestionFilesStatus");
    var askQuestionFilesStatus = document.querySelector(".askQuestionFilesStatus");

    upload_form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
        summaryFiles.innerHTML = "";
        genQuestionFilesStatus.innerHTML = "";
        askQuestionFilesStatus.innerHTML = "";
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
        .catch((err) => file_upload_status.innerHTML = "An error occurred when uploading the file. Please try again");
    });

    summary_button.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/check_files", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.filesExist) {
                window.location.href = "/fetch_summarize_files";
            } else {
                summaryFiles.innerHTML = "You haven\'t uploaded any files yet!";
                return;
            }
        })
        .catch((err) => summaryFiles.innerHTML = "An error occurred when fetching the files. Please try again");
    });

    questions_button.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/check_files", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.filesExist) {
                window.location.href = "/fetch_questions_files";
            } else {
                genQuestionFilesStatus.innerHTML = "You haven\'t uploaded any files yet!";
                return;
            }
        })
        .catch((err) => genQuestionFilesStatus.innerHTML = "An error occurred when fetching the files. Please try again");
    });

    ask_question_button.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/check_files", {
            method: "GET"
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.filesExist) {
                window.location.href = "/fetch_ask_questions_files";
            } else {
                askQuestionFilesStatus.innerHTML = "You haven\'t uploaded any files yet!";
                return;
            }
        })
        .catch((err) => askQuestionFilesStatus.innerHTML = "An error occurred when fetching the files. Please try again");
    })
});