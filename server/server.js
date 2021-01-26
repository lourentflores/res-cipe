const express = require('express');
const path = require('path');
const app = express();
const pg = require('pg');
const db = require('./models/userModel');

const passport = require('passport');

// express validator for validation of information sent to backend
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

// authentication packages
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// routers
const dashRouter = require('./routes/dashRouter');
const userRouter = require('./routes/userRouter');
const loginRouter = require('./routes/loginRouter');

const PORT = 3000;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Validator Middleware
app.use(expressValidator());

// cookieParser middleware
app.use(cookieParser());

// creating new session cookies in db

const pgPool = new pg.Pool({
  connectionString:
    'postgres://yfopfigc:NdRchGgXUa0D2bkRE4haivaL7eXpn86w@ziggy.db.elephantsql.com:5432/yfopfigc',
});

// session middleware and storing session in db
app.use(
  session({
    store: new pgSession({
      // Connection pool
      pool: pgPool,
      // Use another table-name than the default "session" one
      tableName: 'session',
    }),
    secret: 'ZiDwy4h7kZqzuXx',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    // cookie: { secure: true },
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// serve static assets
app.use(express.static(path.resolve(__dirname,'../assets')));

// router for user login
app.use('/login', loginRouter);

// router for user signup
app.use('/signup', userRouter);

app.use('/dashboard', dashRouter);

if (process.env.NODE_ENV === 'production') {
  app.get('/build/bundle.js', (req, res) => {
    console.log(path.join(__dirname, '../build/bundle.js'));
    res.status(200).sendFile(path.join(__dirname, '../build/bundle.js'));
  });

  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}

// verifying username and password exist in database and authenticating and creating login session
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log('username in local strategy: ', username);
    console.log('password in local strategy: ', password);
    db.query(
      'SELECT password, id FROM user_table WHERE username=$1',
      [username],
      (err, results, field) => {
        if (err) {
          done(err);
        }

        if (results.length === 0) {
          done(null, false);
        }
        console.log('these are results: ', results);
        const hash = results.rows[0].password;
        const id = results.rows[0].id;

        bcrypt.compare(password, hash, (err, res) => {
          if (res === true) {
            console.log('login successful');
            return done(null, { userId: id });
          } else {
            console.log('password incorrect');
            return done(null, false);
          }
        });
      }
    );
  })
);

// passport logout functionality
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// Default Error Handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Listening on Port 3000
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
