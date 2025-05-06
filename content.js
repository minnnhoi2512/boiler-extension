const button = document.createElement("button");
button.textContent = "Click Me!";
button.style.position = "fixed";
button.style.top = "10px";
button.style.right = "10px";
button.style.zIndex = "1000";
button.style.padding = "10px";
button.style.backgroundColor = "#007bff";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "5px";

button.addEventListener("click", () => {
    alert("Hello from your Chrome Extension!");
});

document.body.appendChild(button);