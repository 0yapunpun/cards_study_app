const controller = {};

controller.index = async(req, res, next) => {
  if (!req.session.login) { return res.redirect('/login'); }

  res.render('index');
}

controller.login = async(req, res, next) => {
  res.render('login');
}

module.exports = controller