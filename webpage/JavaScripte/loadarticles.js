document.addEventListener("DOMContentLoaded", function () {
    fetch("/?file=data.json").then(response => response.json()).then(jsonData => {
    
    const buttonsContainer = document.getElementById("buttons-container");

    // Parcours du tableau JSON et création des boutons
    jsonData.forEach(item => {
        const button = document.createElement("button");
        const text = document.createElement("h3");
        text.textContent = item.title;
        button.appendChild(text);

        button.addEventListener("click", function () {
            // Redirection vers le fichier HTML en utilisant l'ID
            window.location.href = "/articles/" + item.id;
        });

        button.appendChild(document.createTextNode(item.autor));
        buttonsContainer.appendChild(button);
    });
})
});