if (document.getElementById("form-submit-login")) {
  formSubmit("/login", document.getElementById("form-submit-login"), "json");
}
if (document.getElementById("form-submit-signup")) {
  formSubmit("/signup", document.getElementById("form-submit-signup"), "json");
}
if (document.getElementById("form-submit-folder")) {
  formSubmit(
    "/upload/folders",
    document.getElementById("form-submit-folder"),
    "json"
  );
}
if (document.getElementById("form-submit-file")) {
  formSubmit(
    "/upload/files",
    document.getElementById("form-submit-file"),
    "file"
  );
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
if (document.getElementById("modal-open-upload")) {
  document
    .getElementById("modal-close-upload")
    .addEventListener("click", (ev) => {
      modalHandler("modal-upload");
    });
  document
    .getElementById("modal-open-upload")
    .addEventListener("click", (ev) => {
      modalHandler("modal-upload");
    });
}
function modalHandler(id) {
  document.getElementById("error-container").textContent = "";
  document.getElementById(id).classList.toggle("hide");
}

function formSubmit(url, element, type) {
  element.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const formEntries = Object.fromEntries(formData.entries());

    try {
      const response =
        type === "json"
          ? await fetch(url, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(formEntries),
            })
          : await fetch(url, {
              method: "POST",
              body: formData,
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
