const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');

const userController = require('../controllers/userController');

router.post('/', userController.newUser, (req, res) => {
  // res.status(200).json([res.locals]);
  console.log('this is req.user', req.user);
  console.log('this is req.Authenticated', req.isAuthenticated());
  // console.log(req.session.passport.user)
  if (req.isAuthenticated()) {
    res.locals.isLoggedIn = true;
    console.log(res.locals);
    res.status(200).json(res.locals);

  } else {  
    res.locals.isLoggedIn = false;
    res.status(400).json(res.locals.isLoggedIn);
  }

});


module.exports = router;
