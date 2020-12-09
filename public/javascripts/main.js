const upload = document.querySelector("#file");
const preview = document.querySelector("#imageContainer");
upload.addEventListener("change", function (e) {
  const getFile = e.target.files;
  const image = document.createElement("img");
  var fileReader = new FileReader();
  fileReader.onload = (function (Img) {
    return function (e) {
      Img.src = e.target.result;
    };
  })(image);
  if (getFile) {
    fileReader.readAsDataURL(getFile[0]);
  }
  preview.removeChild(preview.childNodes[0]);
  preview.appendChild(image);
});
