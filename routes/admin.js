var express = require('express');
const mongoose = require('mongoose');
const Country = require('../models/country');
var router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

function isNotLoggedIn(req, res, next) {
  if (!req.session.user) {
    next();
  } else {
    res.redirect('/admin/dashboard');
  }
}

// Apply `isNotLoggedIn` middleware to login routes
router.get('/login', isNotLoggedIn, function(req, res, next) {
  res.render('admin-login', { title: 'Superstar LIVE' });
});

router.post('/login', isNotLoggedIn, function(req, res, next) {
  const { username, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  console.log(adminPassword, adminEmail, username, password)

  if (username === adminEmail && password === adminPassword) {
    // Authentication successful
    req.session.user = username; // Save user to session
    res.redirect('/admin/dashboard');
  } else {
    // Authentication failed
    res.render('admin-login', { error: 'Invalid username or password' });
  }
});

// Apply `isLoggedIn` middleware to dashboard route
router.get('/dashboard', isLoggedIn, function(req, res, next) {
  res.render('index');
  // Your code for the dashboard route goes here
});

module.exports = router;
