async function signUpSubmit(ev) {
  ev.preventDefault();
  const formData = new FormData(ev.target);
  const formEntries = Object.fromEntries(formData.entries());
  try {
    const response = await fetch("/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formEntries),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.errors.length > 0) {
        const error_container = document.getElementById("error-container");
        error_container.textContent = "";
        result.errors.forEach((val) => {
          const textElement = document.createElement("p");
          textElement.textContent = val.msg;
          error_container.append(textElement);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
