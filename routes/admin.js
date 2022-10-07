const express = require('express');
const router = express.Router();
const productContrller = require('./../controller/prodect-controller');

/* GET users listing. */
router.get('/', (req, res, next) => {
  productContrller.getAllProducts().then((prodects) => {
    console.log(prodects);
    res.render('admin/products', { prodects, admin: true });
  });
});

router.get('/add-products', (req, res) => {
  res.render('admin/add-products', { admin: true });
});

router.post('/addProduct', (req, res) => {
  console.log(req.body);
  console.log(req.body.file_img);
  productContrller.addProduct(req.body, (objId) => {
    console.log(objId);
    const image = req.files.file_img;
    image.mv('public/images/products/' + objId + '.jpeg', (err, done) => {
      if (!err) {
        res.render('admin/add-products', { admin: true });
      } else {
        console.log(err);
      }
    });
  });
});

module.exports = router;
