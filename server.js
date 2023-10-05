const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = 80;
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// get web page  (http://localhost:3000/?name=FilePath)
app.get('/', (req, res) => {
  paramValue = req.query.file;
  if (paramValue == undefined ){
    paramValue = "main.html";
  } 
  const filePath = path.join(__dirname, 'webpage', paramValue );
  res.sendFile(filePath);
})

app.get('/profile_or_connect', (req, res) => {
  if (req.cookies.username == undefined){
    res.redirect("/?file=sign/sign_in.html");
  } else {
    res.redirect("/?file=profile/"+req.cookies.username +".html");
  }
})

app.post('/signup', (req, res) => {
  appendToFile('users.json', req.body);
  const filePath = path.join(__dirname,"webpage", 'profile', req.body.username +'.html' );  
  fs.writeFile(filePath, req.body.username, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du fichier :', err);
    } else {
      console.log('Fichier écrit avec succès :', filePath);
    }
  });  
  res.cookie("username", req.body.username);
  res.redirect("/?file=profile/"+req.body.username+".html");
});

// http://0.0.0.0/profile/CoCoSol
app.get("/profile/:profileName", (req,res)=> {
  const  profileName = req.params.profileName
  const contenuHTML = `
  <!DOCTYPE html>
  <html>
  
  <head id="head">
      <meta charset="UTF-8">
      <title>Blog</title>
      <link rel="stylesheet" href="/?file=style.css">
  </head>
  
  <body>
      <div id ="profile"><a href="/profile_or_connect">Profile</a></div>
      <div id="main">
          <div id="title">
              <h2>${profileName}</h2>
          </div>
          <div id="buttons-container">
              <script>
              document.addEventListener("DOMContentLoaded", function () {
                fetch("/?file=data.json").then(response => response.json()).then(jsonData => {
                
                const buttonsContainer = document.getElementById("buttons-container");
            
                // Parcours du tableau JSON et création des boutons
                jsonData.forEach(item => {
                    if (item.autor == ${profileName}) {

                      const button = document.createElement("button");
                      const text = document.createElement("h3");
                      text.textContent = item.title;
                      button.appendChild(text);
              
                      button.addEventListener("click", function () {
                          // Redirection vers le fichier HTML en utilisant l'ID
                          window.location.href = "/?file=articles/" + item.id + "/"+ item.id + ".html";
                      });
              
                      button.appendChild(document.createTextNode(item.autor));
                      buttonsContainer.appendChild(button);
                    }
                });
            })
            });
            </script>
          </div>
      </div>
      <footer>
          <a href="https://github.com/CoCoSol007">GitHub</a> - <a
              href="mailto:solois.corentin@gmail.com?subject=By Blog">E-mail</a>
      </footer>
  </body>
  
  </html>
  `;



  // Envoyez le fichier en réponse à la requête HTTP
  res.setHeader('Content-Type', 'text/html');
  res.send(contenuHTML);
});


app.get('/cookies', (req,res) => {
  const cookie = req.cookies;
  res.send(cookie);

}) ;


app.post('/signin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;


  const usersData = JSON.parse(fs.readFileSync("users.json"));

  let userFound = false;
  for (const user of usersData) {
    if (user.username == username && user.password == password) {
      userFound = true;
      break;
    }
  }
  
  if (userFound) {
    res.cookie("username", req.body.username);
    res.setHeader('Content-Type', 'text/html');
    res.redirect("/?file=profile/"+req.body.username+".html");
  } else {
    res.redirect("/?file=sign/sign_up.html");
  }
});

function appendToFile(fileName, jsonObj) {
  try {
      // Load the current content of the file if it exists
      const existingData = JSON.parse(fs.readFileSync(fileName));

      // Append the new JSON object to the array
      existingData.push(jsonObj);

      // Convert the updated array to JSON format
      const updatedDataJSON = JSON.stringify(existingData, null, 2);

      // Write the updated JSON data to the file
      fs.writeFileSync(fileName, updatedDataJSON);

      console.log('Data successfully appended to the file.');
  } catch (err) {
      // In case of an error while reading the file, continue with an empty array.
      console.error('Error appending data to the file:', err);
  }
}





app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port} on ip: 0.0.0.0`);
});