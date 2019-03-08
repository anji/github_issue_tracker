const request = require('request-promise')
const package_url = require('url')

// Using request-promise package for getting json from url
function get_data (git_link) {
  let headers = {
    'User-Agent': 'request'
  }
  if ('GITHUB_OAUTH' in process.env) {
    headers['Authorization'] = `token ${process.env.GITHUB_OAUTH}`
  }
  const options = {
    url: git_link,
    headers: headers,
    json: true
  }
  return request(options)
}

// From the json data, iterate over each object to find the time of issue, and update each variable accordingly
function get_issue_stat (words) {
  // Filter out pull_request, as github issues api call included pull request
  words = words.filter(word => !('pull_request' in word))

  let less_one_day = 0; let betw_one_seven = 0; let more_than_seven = 0
  let total_issues = Object.keys(words).length
  console.log(Object.keys(words).length)
  for (let i = 0; i < Object.keys(words).length; i++) {
    let today = new Date()
    let then = new Date(words[i]['created_at'])
    // calculate difference between current time and issue time in days
    let diff_days = (today - then) / 86400000
    if (diff_days <= 1) { less_one_day++ } else if (diff_days > 1 && diff_days <= 7) { betw_one_seven++ } else { break }
  }
  more_than_seven = (total_issues - less_one_day - betw_one_seven)

  // Update response object with calculated values
  let issue_stat = {
    'total_issues': total_issues,
    'less_one_day': less_one_day,
    'betw_one_seven': betw_one_seven,
    'more_than_seven': more_than_seven
  }
  // console.log("Issues opened less than 24 hours ago: " + less_one_day);
  // console.log("Issues opened between 24 hours and 1 week ago: " + betw_one_seven);
  // console.log("Issues opened for more than 7 days: " + (total_issues - less_one_day - betw_one_seven));
  return issue_stat
}

// Check URL for correct repository link
function validate_url (url) {
  const myURL = new URL(url)

  // Check for hostname as github.com
  if (myURL.hostname != 'github.com') { return false }

  // Check for pathname to be in format "/user/repository/ "
  let re = new RegExp('(\/([a-zA-Z0-9\-\_\.]*)){2}(\/){0,1}$')
  if (re.test(myURL.pathname)) { return true } else { return false }
}

// Helper function to convert URL to API based URL
function convert_to_api_url (url) {
  const myURL = new URL(url)

  let u = url.split('github.com')
  let res = u[0] + 'api.github.com/repos' + myURL.pathname
  res = res.endsWith('/') ? res.substring(0, res.length - 1) : res
  let issue = res + '/issues?per_page=100&page='

  return { 'repo': res, 'issue': issue }
}

let range = n => Array.from(Array(n).keys())
// Main function that fetches data for each available list of issues pages and updates total counter
async function scrape_data (num, issue_link) {
  let arr = range(parseInt(num / 100) + 1)

  return Promise.all(
    arr.map(async (x) => {
      let wrds = await get_data(issue_link + x)
      return get_issue_stat(wrds)
    }))
}

function agg_data (list_stats) {
  let f_total_issues = 0
  let f_less_one_day = 0
  let f_betw_one_seven = 0
  let f_more_than_seven = 0

  for (var i in list_stats) {
    const pg_stat = list_stats[i]
    f_total_issues += pg_stat.total_issues
    f_less_one_day += pg_stat.less_one_day
    f_betw_one_seven += pg_stat.betw_one_seven
    f_more_than_seven += pg_stat.more_than_seven
  }
  return {
    'f_total_issues': f_total_issues,
    'f_less_one_day': f_less_one_day,
    'f_betw_one_seven': f_betw_one_seven,
    'f_more_than_seven': f_more_than_seven
  }
}

module.exports = {
  get_data,
  validate_url,
  convert_to_api_url,
  get_issue_stat,
  scrape_data,
  agg_data
}
