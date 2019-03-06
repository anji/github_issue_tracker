const request = require('request');

function get_data(git_link) {
    const options = {
        url: git_link,
        headers: {
          'User-Agent': 'request'
        }
      };

    request(options , function (error, response, body) {
        console.log(response.statusCode);
        if(response.statusCode === 200)
          return get_issue_stat(body);
        else 
          console.log("Invalid request URL");
    
    });
}

function get_issue_stat (data) {
    var words=JSON.parse(data);
    var total_issues = Object.keys(words).length
    console.log("Total number of open isues: " + total_issues);


    var less_one_day=0, betw_one_seven=0;
    for (var i = 0; i < Object.keys(words).length; i++) {
        var today = new Date();
        var then = new Date(words[i]['created_at']);
        diff_days =  (today-then)/86400000;
        if(diff_days <= 1)
            less_one_day++;
        else if(diff_days>1 && diff_days <= 7 )
            betw_one_seven++;
        else
            break;
    }
    var issue_stat = {
        "total_issues" : total_issues,
        "less_one_day" : less_one_day,
        "betw_one_seven" : betw_one_seven,
        "more_than_seven" : (total_issues - less_one_day - betw_one_seven)
    }
    console.log("Issues opened less than 24 hours ago: " + less_one_day);
    console.log("Issues opened between 24 hours and 1 week ago: " + betw_one_seven);
    console.log("Issues opened for more than 7 days: " + (total_issues - less_one_day - betw_one_seven));
    return issue_stat;
}


function validate_url(url) {
    var re = new RegExp("^(http(s){0,1})(:(\/\/))(github\.com)(\/([a-zA-Z0-9\-]*)){2}(\/){0,1}$");
    if( re.test(url))
        return true;
    else
        return false;
    
}

function convert_to_api_url (url) {
    var u = url.split("github.com");
    var res = u[0] + "api.github.com/repos" + u[1];
    if(res.endsWith("/"))
        res += "issues"
    else
        res += "/issues"
    console.log(res);
    return res;
}
module.exports = {
    get_data,
    validate_url,
    convert_to_api_url
}

