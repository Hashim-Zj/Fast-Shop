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
  console.log('indexData from indexget :--+++++');
  console.log(indexData);
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
  console.log('indexData from signIn :--+++++');
  console.log(indexData);
  const logdin = req.session.logedIn;
  if (logdin) {
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
  // console.log('indexData from AdminsignIn :--+++++');
  // console.log(indexData);
  // console.log('admin login');
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

router.post('/signin', async (req, res) => {
  // console.log('indexData from postsignin :--+++++');
  // console.log(indexData);
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
// });

/* GET SignUp page. */
router.get('/signUp', (req, res) => {
  indexData.style = 'register';
  const statusData = {
    errMsg: req.session.errMsg,
    body: req.session.Body,
  };
  // console.log('indexData from signUp :--+++++');
  // console.log(indexData);
  res.render('signup', { indexData, statusData });
});

router.post('/signUp', (req, res) => {
  const logStatus = logsController.newLogin(req.body);
  if (logStatus.status) {
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

router.get('/signout', (req, res) => {
  req.session.destroy();
  res.redirect('/signin');
});

module.exports = router;
