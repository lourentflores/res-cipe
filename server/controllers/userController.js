const db = require('../models/userModel');
const expressValidator = require('express-validator');
const passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {};

userController.newUser = (req, res, next) => {
  console.log('inside userController');
  const { username, password, email, firstName, lastName } = req.body;
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req
    .checkBody('username', 'Username must be between 4-15 characters long.')
    .len(4, 15);
  req
    .checkBody('email', 'The email you entered is invalid, please try again.')
    .isEmail();
  req
    .checkBody(
      'email',
      'Email address must be between 4-100 characters long, please try again.'
    )
    .len(4, 100);
  req
    .checkBody('password', 'Password must be between 8-100 characters long.')
    .len(8, 100);
  req
    .checkBody(
      'password',
      'Password must include one lowercase character, one uppercase character, a number, and a special character.'
    )
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
      'i'
    );
  req
    .checkBody(
      'passwordMatch',
      'Password must be between 8-100 characters long.'
    )
    .len(8, 100);
  req
    .checkBody('passwordMatch', 'Passwords do not match, please try again.')
    .equals(req.body.password);
  // Additional validation to ensure username is alphanumeric with underscores and dashes
  req
    .checkBody(
      'username',
      'Username can only contain letters, numbers, or underscores.'
    )
    .matches(/^[A-Za-z0-9_-]+$/, 'i');

  const errors = req.validationErrors();

  if (errors) {
    return next({
      log: `ERROR: useController.js: Form validation errors: ${errors}`,
      status: 400,
      message: { err: 'Form validation error' },
    });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      // Store hash in your password DB.
      console.log('inside bcrypt func');
      const queryStr =
        'INSERT INTO user_table (username, password, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id';
      const queryParams = [username, hash, email, firstName, lastName];
      try {
        await db.query(queryStr, queryParams, (error, results, fields) => {
          if (error) throw error;
          console.log(results.rows[0]);
          const { id } = results.rows[0];
          req.login(id, (err) => {
            //passport login
            res.locals.id = id;
            return next();
            // res.redirect('/');
          });
        });
        // return next();
      } catch (error) {
        console.log('error from our db', error);
        return next({
          log: `Database error`,
          status: 502,
          message: { err: `${error.stack}` },
        });
      }
    });
  }
};
passport.serializeUser(function (id, done) {
  done(null, id);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

userController.login = (req, res, next) => {};

module.exports = userController;
