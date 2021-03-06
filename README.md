# Github Issue Tracker

Fetch given github repository and display open issues of that particular repository.

Hosted on heroku : https://immense-tundra-24736.herokuapp.com/

### Prerequisites 

Docker should be installed.

Official website for downloading Docker: https://www.docker.com/

### Installing

In the root project directory build dockerfile

```
docker build . --tag deploy
```

## Deployment

Run docker using the following command for server deployment

```
docker run -p 8080:8080 -t deploy
```

On Success, project is successfully deployed on http://localhost:8080/

## Built With
* Express [https://expressjs.com/] - The Web Framework
* Chart [https://www.chartjs.org/] - For displaying charts
* Docker [https://www.docker.com/] - For deployment of applications inside software containers 

## Future Work
* Make it generic issue tracker for other version control system like gitlab, bitbucket etc
* Save the fetched data to database to track change in open issue of a repository with time
* Automate fetching data for required repository
* Link with github account or any other VCS for tracking starred repositoty automatically
* Integrating with a frontend framwork like Angular/React etc.


## Authors

* **Anjani Kumar** 
