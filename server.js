const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
const path = require('path');


// get web page  (http://localhost:3000/?name=FilePath)
app.get('/', (req, res) => {
  paramValue = req.query.file;
  if (paramValue == undefined ){
    paramValue = "main.html"
  } 
  const filePath = path.join(__dirname, 'webpage', paramValue );
  res.sendFile(filePath);
})

const port = 3000;

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
