document.addEventListener("DOMContentLoaded", function() {
    var summarize_button = document.querySelector("#summarizeFileButton");
    var fileType = document.getElementById("summarizeFileSelect");
    var summarizeFileStatus = document.querySelector(".summarizeFileStatus");

    summarize_button.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
        if (selectedFile === undefined) {
            summarizeFileStatus.innerHTML = "You need to select a file!";
            return;
        }
        summarizeFileStatus.innerHTML = "Loading...";
        try {
            window.location.href = `/generate_summary?file=${selectedFile}`;
        } catch (error) {
            summarizeFileStatus.innerHTML = "An error occurred when generating the summary. Please try again";
        }
    });
})