document.addEventListener("DOMContentLoaded", function() {
    var summarize_button = document.querySelector("#summarizeFileButton");
    var fileType = document.getElementById("summarizeFileSelect");

    summarize_button.addEventListener("click", (e) => {
        e.preventDefault();
        const selectedFile = Array.from(fileType.options).filter(option => option.selected).map(option => option.value)[0];
        console.log(selectedFile);
        window.location.href = `/generate_summary?file=${selectedFile}`;
    });
})