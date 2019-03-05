const express = require('express');
var http = require('http');

const app = express();

app.use(express.static('public'));

// start the express web server listening on 8081
app.listen(8081, () => {
  console.log('listening on 8081');
});

// serve the homepage
app.get( '/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/results', (req, res) => {
  // console.log(req.query);
  console.log("anjani");
  res.send();
});