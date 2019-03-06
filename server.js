const express = require('express');
var http = require('http');
const bodyParser = require('body-parser');

let issue = require('./issue_diff');

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

var arr;
app.post('/results', (req, res) => {
  console.log("Checking Issue Stat for: " + req.body['git_link']);
  let git_link = req.body['git_link'];
  if(! issue.validate_url(git_link)) {
    console.log("Invalid URL, Check Link");
    return;
  }
  git_link = issue.convert_to_api_url(git_link);
  
  let prom = new Promise(function(resolve, reject) {
    let results = issue.get_data(git_link);
    resolve(results);
  });

  prom.then(function(results) {
    console.log(results);
  })
  console.log("anjani ");
  
  res.send();
});

