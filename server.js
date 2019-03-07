const express = require('express')
const bodyParser = require('body-parser')

let issue = require('./issue_diff')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'pug')

var port = process.env.PORT || 8080
// start the express web server listening on 8081
app.listen(port, () => {
  console.log('listening on ' + port)
})

// serve the homepage
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/results', (req, res) => {
  console.log('Checking Issue Stat for: ' + req.body.url_link)
  let git_link = req.body.url_link

  if (!issue.validate_url(git_link)) {
    console.log('Invalid URL, Check Link')
    res.render('error_page', {url: req.body.url_link})
    return
  }
  git_link = issue.convert_to_api_url(git_link)
  issue.scrape_data(git_link).then(
    stats => {
    res.render('results', {stats: stats, url: req.body.url_link})
  }).catch(
    (error) => res.render('error_page', {url: req.body.url_link}))
  console.log('finished')
})
