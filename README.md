# Result-Tracker



RESULT TRACKER APP OF DSC IMSU

This is a progressive web app which enables students to calculate and keep track of their results for future references.


*Welcome, and thank you for contributing to this project. Please take your time to study this document carefully before making any changes to the codebase, to ensure you're on the same page with the rest of the team and we can all collaborate seamlessly.* 

## Set up and Contribution
To set up this project, first fork this repositiory to your own account
```bash
Locate fork button and click on it.
```
Then go to your desktop and create a folder, name it resultTracker.

Open the folder (resultTracker), right click and select the option gitbash here (ensure you have git installed).

Then run all the commands in the git terminal that will open.

Make the folder a git folder by running the following command
```
git init
```
Set up your origin and upstream remotes by running the following commands
```bash
git remote add origin https://github.com/{YOUR-GITHUB-USERNAME}/resultTracker.git

git remote add upstream https://github.com/dscimsu/resultTracker.git

```

Pull the code to Your project directory and set it up by running the following command
```bash
git fetch upstream
git checkout master
```
To install the dependencies the app is using run the command (ensure you have node installed)
```
npm install
```
To start the application on your localhost run the command

```
  npm install nodemon -g
```
 Then start your app using nodemon 
 ```
 nodemon
 ```
// Then go to your browser and and type http://localhost:8000/ 
```
After contributing based on a specified issue, run the following commands after commiting changes
```bash
git pull upstream
git push origin develop

```
Then from your develop branch you create a pull request to your master,
Then from your master branch in your forked repository, create a pull request to the 
dscimsu develop branch.

# Thanks for contributing.
