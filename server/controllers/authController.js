const db = require('../models/userModel');
const session = require('express-session');

const authController = {};

authController.verifyUser = (req, res, next) => {
  try {
    if (
      req.session.passport.user.userId &&
      req.session.passport.user.userId == req.params.id
    ) {
      return next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    return next({
      log: `authController.verifyUser: ERROR: ${error}`,
      message: { error: 'An internal error occured :( ' },
    });
  }
};

module.exports = authController;
