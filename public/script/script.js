async function formSubmit(ev, url) {
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
}
