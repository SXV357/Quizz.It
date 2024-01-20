var file_upload_status = document.querySelector(".file_upload_status")
var file_input = document.querySelector("#file_input")
var upload_button = document.querySelector("#upload")
var formData = new FormData();

upload_button.addEventListener("submit", (e) => {
    e.preventDefault();
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

function get_summary() {

} 

function generate_pdf() {

}