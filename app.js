let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let indexRouter = require('./routes/index');
let adminRouter = require('./routes/admin');
const handlebars = require('express-handlebars');
require('dotenv').config();
let app = express();

// Add express-session
let session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/superstar-database')
  .then(() => { console.log('Connected to MongoDB'); })
  .catch((err) => { console.log(err); });

// View engine setup
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    path.join(__dirname, 'views/partials'),
  ]
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware setup
app.use(session({
  secret: 'yourSecretKey', // Replace 'yourSecretKey' with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.get('/', function (req, res, next) {
  res.redirect('/admin/dashboard');
});

app.get('/admin', function (req, res, next) {
  res.redirect('/admin/dashboard');
});

app.get('/api*', function (req, res, next) {
  if (req.headers['server_key'] !== `${process.env.SERVER_KEY}`) {
    res.status(401).json({ error: 'Unauthorized Access' });
  } else {
    next();
  }
});

app.post('/api*', function (req, res, next) {
  if (req.headers['server_key'] !== `${process.env.SERVER_KEY}`) {
    res.status(401).json({ error: 'Unauthorized Access' });
  } else {
    next();
  }
});

app.use('/api', indexRouter);
app.use('/admin', adminRouter);

module.exports = app;
