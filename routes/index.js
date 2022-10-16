const express = require('express');
const router = express.Router();
const logsController = require('./../controller/logsController');

const fs = require('fs');
const indexData = {
  js: 'script',
};

/* GET home page. */
router.get('/', (req, res, next) => {
  const data = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`));
  indexData.style = 'style';
  res.render('index', { indexData, data });
});

/* GET user SignIn page. */
router.get('/signIn', (req, res) => {
  indexData.style = 'login';
  indexData.log = {
    admin: false,
    user: true,
    logType: 'user',
    message: '',
  };
  const logdIn = req.session.logedIn;
  console.log('logedin___________' + logdIn);
  if (logdIn) {
    console.log('logedin++++++++++++++++++++' + logdIn);
    res.redirect('/users/');
  } else {
    const statusData = {
      errMsg: req.session.errMsg,
      body: req.session.Body,
    };
    res.render('signin', { indexData, statusData });
  }
});

/* GET admin SignIn page. */
router.get('/adminSignIn', (req, res) => {
  indexData.style = 'login';
  indexData.log = {
    admin: true,
    user: false,
    logType: 'admin',
    message: 'As Administrator',
  };
  const logdIn = req.session.logedIn;
  console.log('logedin___________' + logdIn);
  if (logdIn) {
    console.log('logedin++++++++++++++++++++' + logdIn);
    res.redirect('/admin/');
  } else {
    const statusData = {
      errMsg: req.session.errMsg,
      body: req.session.Body,
    };
    res.render('signin', { indexData, statusData });
  }
});

/* POST SignIn. */
router.post('/signin', async (req, res) => {
  const logStatus = await logsController.Login(req.body);
  if (logStatus.status) {
    console.log('login  sucesssfull');
    req.session.logedIn = true;
    req.session.Body = logStatus.Body;
    req.body.logType === 'user'
      ? res.redirect('/users/')
      : res.redirect('/admin/');
  } else {
    req.session.errMsg = logStatus.errMsg;
    req.session.Body = req.body;
    req.body.logType === 'user'
      ? res.redirect('/signIn')
      : res.redirect('/adminSignIn');
  }
});

/* GET SignUp page. */
router.get('/signUp', (req, res) => {
  indexData.style = 'register';
  const logdIn = req.session.logedIn;
  console.log('logedin___________' + logdIn);
  if (logdIn) {
    console.log('logedin++++++++++++++++++++' + logdIn);
    (req.body.logType === 'user')
      ? res.redirect('/users/')
      : res.redirect('/adminSignIn');
  } else {
    const statusData = {
      errMsg: req.session.errMsg,
      body: req.session.Body,
    };
    res.render('signup', { indexData, statusData });
  }
});

/* POST SignUp. */
router.post('/signUp', async (req, res) => {
  const logStatus = await logsController.newLogin(req.body);
  console.log(logStatus);
  if (logStatus.status) {
    console.log('registration successfull');
    if (req.body.logType === 'user') {
      req.session.logedIn = true;
      req.session.Body = logStatus.Body;
      res.redirect('/users/');
    } else {
      res.redirect('/adminSignIn');
    }
  } else {
    req.session.errMsg = logStatus.errMsg;
    req.session.Body = req.body;
    res.redirect('/signUp');
  }
});

/* GET LogOut */
router.get('/signout', (req, res) => {
  req.session.destroy();
  res.redirect('/signin');
});

module.exports = router;
