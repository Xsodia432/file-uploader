if (document.getElementById("form-submit-login")) {
  formSubmit("/login", document.getElementById("form-submit-login"));
}
if (document.getElementById("form-submit-signup")) {
  formSubmit("/signup", document.getElementById("form-submit-signup"));
}
if (document.getElementById("form-submit-folder")) {
  formSubmit("/upload/folders", document.getElementById("form-submit-folder"));
}

if (document.getElementById("form-rename")) {
  formSubmit("/update/file", document.getElementById("form-rename"));
}
if (document.getElementById("form-share")) {
  formSubmit("/file/share", document.getElementById("form-share"));
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
      modalHandlerGeneral("modal-form");
    });
  document.getElementById("modal-open").addEventListener("click", (ev) => {
    modalHandlerGeneral("modal-form");
  });
}

function modalHandlerGeneral(id) {
  document.getElementById("error-folder-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
}

function formSubmit(url, element) {
  element.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const fileId = ev.currentTarget.dataset.fileId
      ? ev.currentTarget.dataset.fileId
      : ev.target.elements["file_name"]
      ? ev.target.elements["file_name"].dataset.fileId
      : null;
    const fileType = ev.currentTarget.dataset.fileType
      ? ev.currentTarget.dataset.fileType
      : null;

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
        const result = await response.json();
        const error_container = result.errorContainer
          ? document.getElementById(result.errorContainer)
          : " ";

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
