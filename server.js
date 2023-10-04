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
  if (1==1){
    res.redirect("/?file=sign/sign_in.html");
  } else {
    res.redirect("/?file=profile.html");
  }
})

app.post('/signup', (req, res) => {
  appendToFile('users.json', req.body);
  res.cookie("username", req.body.username);
  res.redirect("/?file=profile.html");
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
    res.redirect("/?file=profile.html");
  } else {
    res.send('Informations de connexion incorrectes');
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