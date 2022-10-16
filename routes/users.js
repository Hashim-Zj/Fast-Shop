const express = require('express');
const router = express.Router();
const adminControlles = require('./../controller/adminControlles');

const user = {
  user: true,
  style: 'style',
};

/* GET home page. */
router.get('/', (req, res, next) => {
  adminControlles.getAllProducts().then((prodects) => {
    if (req.session.logedIn) {
      const userData = req.session.Body;
      const products = prodects;
      res.render('users/index', { user, userData, products });
    } else {
      res.redirect('/signIn');
    }
  });
});

module.exports = router;
