const express = require('express')
const bodyParser = require('body-parser')

// issue_diff.js includes all the utility function required for the project
let issue = require('./issue_diff')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

// Using pugjs template engine for HTML page rendering
app.set('view engine', 'pug')

// Setting port for the server to listen on
let port = process.env.PORT || 8080
let server = app.listen(port, () => {
  console.log('listening on ' + port)
})

server.on('connection', function (socket) {
  console.log('A new connection was made by a client.')
  socket.setTimeout(12 * 60 * 1000)
  // 12 min timeout.
})

// serve the homepage
app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

// For displaying result of the fetched URL
app.post('/results', (req, res) => {
  console.log('Checking Issue Stat for: ' + req.body.url_link)
  let git_link = req.body.url_link

  // Parse URL to validate the fetched link
  if (!issue.validate_url(git_link)) {
    console.log('Invalid URL, Check Link')
    res.render('error_page', { url: req.body.url_link, message: 'Invalid URL!' })
    return
  }

  // Convert user given url into API URL for github api requests
  git_link = issue.convert_to_api_url(git_link)

  // Scrape data from the API URL
  issue.scrape_data(git_link).then(
    stats => {
    // Display results page using pugjs render engine
      res.render('results', { stats: stats, url: req.body.url_link })
    }).catch(
    // Display error page using pugjs render engine
    (error) => {
      console.log(error.message)
      res.render('error_page', { url: req.body.url_link, message: error.error.message })
    })
  console.log('finished')
})
