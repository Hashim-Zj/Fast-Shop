const express = require('express');
const router = express.Router();
const productContrller = require('./../controller/prodectController');

const user = {
  user: true,
  style: 'style',
};

/* GET home page. */
router.get('/', (req, res, next) => {
  productContrller.getAllProducts().then((prodects) => {
    if (req.session.logedIn) {
      const userData = req.session.Body;
      const products = prodects;
      res.render('users/index', { user, userData, products });
    } else {
      res.redirect('/signIn');
    }
  });
});

router.get('/myCarts', (req, res) => {
  res.render('users/carts');
});

module.exports = router;
