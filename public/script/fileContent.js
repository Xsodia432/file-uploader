document.querySelectorAll(".options").forEach((ev, index) => {
  ev.addEventListener("click", (ev) => {
    document.querySelectorAll(".drop-down-options").forEach((ev) => {
      ev.classList.remove("visible");
    });
    document
      .querySelectorAll(".drop-down-options")
      [index].classList.add("visible");
  });
});

document.querySelectorAll(".share-option").forEach((ev, index) => {
  ev.addEventListener("click", () => {
    document
      .querySelectorAll(".share-container")
      [index].classList.add("share-container-visible");
  });
  document
    .querySelectorAll(".share-container")
    [index].addEventListener("mouseleave", () => {
      document.querySelectorAll(".share-container").forEach((event) => {
        event.classList.remove("share-container-visible");
      });
    });
});

document.addEventListener("click", (ev) => {
  ev.stopPropagation();
  if (
    ev.target.querySelector(".drop-down-options") ===
    document.querySelector(".drop-down-options")
  ) {
    if (document.querySelector(".visible"))
      document.querySelector(".visible").classList.remove("visible");
  }
});
document.querySelectorAll(".rename").forEach((ev, index) => {
  ev.addEventListener("click", () => {
    modalHandler("modal-rename");
    const file_name = document.querySelectorAll(".file-name")[index];
    const fileInput = document.getElementById("file_name");
    fileInput.value = file_name.innerText;
    fileInput.setAttribute("data-file-id", file_name.dataset.fileId);
    fileInput.setAttribute("data-file-type", file_name.dataset.fileType);
  });
});
function modalHandler(id) {
  document.getElementById("error-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
}
document
  .getElementById("modal-close-rename")
  .addEventListener("click", (ev) => {
    modalHandler("modal-rename");
  });
