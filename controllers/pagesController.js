// getting home page
exports.getHomePage = (req, res, next) => {
  res.render("index", { title: "ResultTracker" });
};

// getting contact page
exports.getContactPage = (req, res, next) => {
  res.render("contact");
};

//getting about page
exports.getAboutPage = (req, res, next) => {
  res.render("about");
};

//getting check result page
exports.getCheckResultPage = (req, res, next) => {
  res.render("checkresults", { title: "ResultTracker" });
};

//getting secondary school dashboard page
exports.getSecDashboardPage = (req, res, next) => {
  res.render("secdashboard", { title: "ResultTracker" });
};
