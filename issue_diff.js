const request = require('request-promise');

function get_data(git_link) {
    const options = {
        url: git_link,
        headers: {
          'User-Agent': 'request'
        },
        json: true
      };
    // console.log("anjani");
    return request(options)
}

function get_issue_stat (words) {
    // var words=JSON.parse(data);
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
        res += "issues?page="
    else
        res += "/issues?page="
    // console.log(res);
    return res;
}

async function scrape_data(git_link) {
    let f_total_issues = 0;
    let f_less_one_day = 0;
    let f_betw_one_seven = 0;
    let f_more_than_seven = 0;
    let page_num=1;
    let page_link = git_link + page_num;
    let break_flag = true;

    do {
      let raw_data = await get_data(page_link);
      console.log(page_link + " " + Object.keys(raw_data).length);
      if(Object.keys(raw_data).length == 0 ) {
        console.log("Empty page received");
        break_flag = false;
      }
      else {
        var pg_stat = get_issue_stat(raw_data);
        f_less_one_day += pg_stat.less_one_day;
        f_total_issues += pg_stat.total_issues;
        console.log("data :" + f_less_one_day + " " + f_total_issues);
        page_link = git_link + page_num;
        page_num++;
      }

    }while(break_flag);

    let fin_stat = {
        "f_total_issues": f_total_issues,
        "f_less_one_day": f_less_one_day,
        "f_betw_one_seven": f_betw_one_seven,
        "f_more_than_seven": f_more_than_seven
      }
    return fin_stat;
  }

module.exports = {
    get_data,
    validate_url,
    convert_to_api_url,
    get_issue_stat, 
    scrape_data
}

