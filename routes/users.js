const express = require('express');
const router = express.Router();
const productContrller = require('./../controller/prodectController');
const userContrller = require('./../controller/logsController');
const user = {
  user: true,
  style: 'styles',
};
/* GET home page. */
router.get('/', (req, res, next) => {
  productContrller.getAllProducts().then((prodects) => {
    if (req.session.logedIn) {
      const datas = {
        user: req.session.Body,
        products: prodects,
      }
      res.render('users/index', { user, datas });
    } else {
      res.redirect('/signin');
    }
  });
});

router.get('/signout', (req, res) => {
  req.session.destroy();
  res.redirect('/signin');
});

router.get('/myCarts', (req, res) => {
  res.render('users/carts');
});

module.exports = router;
