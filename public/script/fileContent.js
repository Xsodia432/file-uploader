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

  if (
    !document
      .querySelectorAll(".share-button")
      [index].classList.contains("folder-with-duration")
  ) {
    document
      .querySelectorAll(".share-button")
      [index].addEventListener("click", (ev) => {
        modalHandler("modal-share", "form-share", index);
      });
  }
});

document.querySelectorAll(".rename").forEach((ev, index) => {
  ev.addEventListener("click", () => {
    modalHandlerRename("modal-rename", "file_name", index);
  });
});

function modalHandler(id, form, index) {
  document.getElementById("error-share-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
  const file_name = document.querySelectorAll(".file-name")[index];
  const fileInput = document.getElementById(form);
  fileInput.value = file_name.innerText;
  fileInput.setAttribute("data-file-id", file_name.dataset.fileId);
  fileInput.setAttribute("data-file-type", file_name.dataset.fileType);
}
function modalHandlerRename(id, field, index) {
  document.getElementById("error-rename-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
  const file_name = document.querySelectorAll(".file-name")[index];
  const fileInput = document.getElementById(field);
  fileInput.value = file_name.innerText;
  fileInput.setAttribute("data-file-id", file_name.dataset.fileId);
  fileInput.setAttribute("data-file-type", file_name.dataset.fileType);
}
function modalHandlerClose(id) {
  document.getElementById("error-rename-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
}
document
  .getElementById("modal-close-rename")
  .addEventListener("click", (ev) => {
    modalHandlerClose("modal-rename");
  });

document.getElementById("modal-close-share").addEventListener("click", (ev) => {
  modalHandlerClose("modal-share");
});
document.addEventListener("click", (ev) => {
  if (document.getElementById("profile")) {
    if (!document.getElementById("profile-container").contains(ev.target)) {
      document.getElementById("profile-content").classList.remove("visible");
    }
  }

  if (document.getElementById("main-content")) {
    document.querySelectorAll(".table-options").forEach((val, index) => {
      if (!val.contains(ev.target)) {
        document
          .querySelectorAll(".drop-down-options")
          [index].classList.remove("visible");
      }
    });
  }
});
function submitHandler(ev) {
  return ev.preventDefault();
}
function copyHandler(id) {
  navigator.clipboard.writeText(
    window.location.hostname + ":" + window.location.port + `/file/i/${id}`
  );
  alert("URL copied");
}
function copyHandlerFolder(id) {
  navigator.clipboard.writeText(window.location.href + `share/${id}`);
  alert("URL copied");
}
function confirmation() {
  return confirm("Are you sure? This will permanently delete.");
}
