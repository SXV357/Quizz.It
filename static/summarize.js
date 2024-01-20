document.addEventListener("DOMContentLoaded", function() {
    var summarize_button = document.querySelector("#summarizeFileButton");
    var fileType = document.getElementById("summarizeFileSelect");
    var summarizeFileStatus = document.querySelector(".summarizeFileStatus");

    summarize_button.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
        console.log(selectedFile);
        summarizeFileStatus.innerHTML = "Loading...";
        window.location.href = `/generate_summary?file=${selectedFile}`;
    });
})