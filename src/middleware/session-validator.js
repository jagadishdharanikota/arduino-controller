export default (req, res, next) => {
  if (isValidSession(req)) {
    return next();
  }

  res.redirect(302, '/');
};

function isValidSession(req) {
  return req && req.user;
}

function checkAuthenticated(req, res, next) {
  // Passport provided isAuthenticated API which check for req.user
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect(302, '/');
}

function checkNotAuthenticated(req, res, next) {
  // Passport provided isAuthenticated API which check for req.user
  if (req.isAuthenticated()) {
    return res.redirect(302, '/app/appinno');
  }

  next();
}

export { isValidSession, checkAuthenticated, checkNotAuthenticated };
