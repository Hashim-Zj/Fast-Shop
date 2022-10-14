const express = require('express');
const router = express.Router();
const logsController = require('./../controller/logsController');

const fs = require('fs');
const data = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`));
const indexData = {
  type: 'main',
  data: data,
};

/* GET home page. */
router.get('/', (req, res, next) => {
  indexData.style = 'style';
  res.render('index', { indexData });
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
  const logdin = req.session.logedIn
  if (logdin) {
    console.log('_________{users}_________');
    res.redirect('/users/');
  } else {
    console.log('_________[signin]_________');
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
  console.log('admin login');
  if (req.session.logedIn) {
    console.log('session login');
    res.redirect('/users/');
  } else {
    const statusData = {
      errMsg: req.session.errMsg,
      body: req.session.Body,
    };
    res.render('signin', { indexData, statusData });
  }
});

router.post('/signin', (req, res) => {
  logsController.Login(req.body).then((logStatus) => {
    if (logStatus.status) {
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
});

/* GET SignUp page. */
router.get('/signUp', (req, res) => {
  indexData.style = 'register';
  const statusData = {
    errMsg: req.session.errMsg,
    body: req.session.Body,
  };
  res.render('signup', { indexData, statusData });
});

router.post('/signUp', (req, res) => {
  logsController.newLogin(req.body).then((logStatus) => {
    if (logStatus.status) {
      if (req.body.logType === 'user') {
        req.session.logedIn = true;
        req.session.Body = logStatus.Body;
        res.redirect('/users/');
      } else res.redirect('/adminSignIn');
    } else {
      console.log('____________}{}{}{___________');
      console.log(logStatus.errMsg);
      console.log(logStatus.errMsg.sPswErrMsg);
      req.session.errMsg = logStatus.errMsg;
      req.session.Body = req.body;
      res.redirect('/signUp');
    }
  });
});

module.exports = router;
