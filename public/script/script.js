if (document.getElementById("form-submit-login")) {
  formSubmit("/login", document.getElementById("form-submit-login"));
}
if (document.getElementById("form-submit-signup")) {
  formSubmit("/signup", document.getElementById("form-submit-signup"));
}
if (document.getElementById("form-submit-folder")) {
  formSubmit("/upload/folders", document.getElementById("form-submit-folder"));
}

if (document.getElementById("modal-open")) {
  document.getElementById("modal-close").addEventListener("click", (ev) => {
    modalHandler();
  });
  document.getElementById("modal-open").addEventListener("click", (ev) => {
    modalHandler();
  });
}
function modalHandler() {
  document.getElementById("error-container").textContent = "";
  document.querySelector(".modal").classList.toggle("hide");
}

function formSubmit(url, element) {
  element.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const formEntries = Object.fromEntries(formData.entries());
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
