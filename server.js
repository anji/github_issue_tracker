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
  let agg_link = issue.convert_to_api_url(git_link)
  let num_issues
  issue.get_data(agg_link.repo).then(
    repo_data => {
      num_issues = repo_data.open_issues_count
      issue.scrape_data(num_issues, agg_link.issue).then((data) => {
        const aggregated = issue.agg_data(data)
        res.render('results', { stats: aggregated, url: req.body.url_link })
      })
    }).catch(
    err => {
      console.log('error finding repo issues count', err)
      res.render('error_page', { url: req.body.url_link, message: error.error.message })
    })
})
