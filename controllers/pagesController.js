// getting home page
exports.getHomePage = (req, res, next) => {
  res.render("index", { path: "/" }); 
};

// getting contact page
exports.getContactPage = (req, res, next) => {
  res.render("contact",{path:'/contact'});
};

//getting about page
exports.getAboutPage = (req, res, next) => {
  res.render("about", {path:'/about'});
};


//getting secondary school dashboard page
exports.getSecDashboardPage = (req, res, next) => {
  res.render("secdashboard", { title: "ResultTracker" });
};
