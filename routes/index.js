const express = require('express');
const router = express.Router();
const logsController = require('./../controller/logsController');

const fs = require('fs');
const data = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`));
const indexData = {
  req: true,
  style: '',
  js: 'main',
  type: 'main',
  data: data,
};

/* GET home page. */
router.get('/', (req, res, next) => {
  indexData.style = 'style';
  console.log(indexData.style);
  res.render('index', { indexData });
});

router.get('/signin', (req, res) => {
  indexData.style = 'login';
  indexData.log = {
    admin: false,
    user: true,
    logType: 'user',
    message: '',
  };
  res.render('signin', { indexData });
});

router.get('/signIn', (req, res) => {
  indexData.style = 'login';
  indexData.log = {
    admin: true,
    user: false,
    logType: 'admin',
    message: 'As Administrator 🎖',
  };
  res.render('signin', { indexData });
});

router.get('/signup', (req, res) => {
  indexData.style = 'register';
  indexData.log = {
    admin: false,
    user: true,
    logType: 'user',
    message: '',
  };
  if (req.session.loggedIn) {
    res.redirect('/users/');
  } else {
    const logError = {
      curentData: req.session.curentData,
      logError: req.session.logError,
      view: req.session.errorVisible,
    };
    res.render('signup', { indexData, logError });
  }
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  logsController.newLogin(req.body).then((logStatus) => {
    if (logStatus.status) {
      req.session.loggedIn = true;
      req.session.InsrtedData = logStatus.InsrtedData;
      req.session.client = logStatus.Data;
      req.session.errorVisible = 'hidden';
      req.body.logType === 'user'
        ? res.redirect('/users/')
        : res.redirect('/admin/');
    } else {
      req.session.logError = logStatus.error.errorMessage;
      req.session.curentData = req.body;
      res.redirect('/signup');
    }
  });
});

router.get('/addAdmin', (req, res) => {
  indexData.style = 'register';
  indexData.log = {
    admin: true,
    user: false,
    logType: 'admin',
    message: 'As Admin 🎖',
  };
  res.render('signup', { indexData });
});
module.exports = router;
