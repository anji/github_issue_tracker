const express = require('express');
var http = require('http');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json())

// start the express web server listening on 8081
app.listen(8081, () => {
  console.log('listening on 8081');
});

// serve the homepage
app.get( '/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/results', (req, res) => {
  console.log(req.body['git_link']);
  console.log("anjani");
  res.send();
});