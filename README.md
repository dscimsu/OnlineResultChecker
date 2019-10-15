# Result-Tracker
This is a progressive web app which enables students to calculate and keep track of there results for for future purposes or reference.


*Welcome, and thank you for contributing to this project. Please take your time to study this document carefully before making any changes to the codebase, to ensure you're on the same page with the rest of the team and we can all collaborate seamlessly.* 

## Set up and Contribution
To set up this project, first fork this repositiory to your own acount
```bash
Locate fork button and click on it.
```
Change your working directory into the project directory
```bash
$ cd result-tracker
```

Set up your origin and upstream remotes by running the following commands
```bash
git remote add origin git://github.com/{YOUR-GITHUB-USERNAME}/resultTracker.git

git remote add upstream git://github.com/dscimsu/resultTracker.git

```

Pull the code to Your project directory and set it up by running the following command
```bash
git fetch upstream
git checkout master
npm install
node index
 
// Then go to your browser and and type http://localhost:3000/ 
```
After contributing based on a specified issue, run the following commands after commiting changes
```bash
git pull origin develop
git push origin develop

```
Then from your develop branch you create a pull request to your master,
Then from your master branch in your forked repository, create a pull request to the 
dscimsu develop branch.

# Thank for contributing.