if (document.getElementById("form-submit-login")) {
  formSubmit("/login", document.getElementById("form-submit-login"));
}
if (document.getElementById("form-submit-signup")) {
  formSubmit("/signup", document.getElementById("form-submit-signup"));
}
if (document.getElementById("form-submit-folder")) {
  formSubmit("/upload/folders", document.getElementById("form-submit-folder"));
}

if (document.getElementById("form-update-rename")) {
  formSubmit("/update/file", document.getElementById("form-update-rename"));
}

if (document.getElementById("file-input")) {
  document.getElementById("file-input").addEventListener("change", (ev) => {
    document.getElementById("form-upload-file").submit();
  });
}

if (document.getElementById("modal-open")) {
  document
    .getElementById("modal-close-form")
    .addEventListener("click", (ev) => {
      modalHandler("modal-form");
    });
  document.getElementById("modal-open").addEventListener("click", (ev) => {
    modalHandler("modal-form");
  });
}

function modalHandler(id) {
  document.getElementById("error-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
}

function formSubmit(url, element) {
  element.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const fileId = ev.target.elements["file_name"]
      ? ev.target.elements["file_name"].dataset.fileId
      : null;
    const fileType = ev.target.elements["file_name"]
      ? ev.target.elements["file_name"].dataset.fileType
      : null;
    console.log(fileType);
    const formEntries = {
      ...Object.fromEntries(formData.entries()),
      file_id: fileId,
      file_type: fileType,
    };
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formEntries),
      });

      if (response.ok) {
        const error_container = document.getElementById("error-container");
        const result = await response.json();

        if (result.errors) {
          error_container.textContent = "";
          result.errors.forEach((val) => {
            const textElement = document.createElement("p");
            textElement.textContent = val.msg;
            error_container.append(textElement);
          });
        } else {
          error_container.textContent = "";
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
}
