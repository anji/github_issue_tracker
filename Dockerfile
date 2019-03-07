FROM node:11
RUN mkdir -p /tmp/github_issue_tracker
WORKDIR /tmp/github_issue_tracker
ADD package.json ./
ADD package-lock.json ./
RUN npm install
ADD . ./
EXPOSE 8080
ENTRYPOINT [ "npm" , "start" ]