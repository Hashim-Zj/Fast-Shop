const express = require('express');
const router = express.Router();
const productContrller = require('./../controller/prodectController');
const admin = {
  admin: true,
  style: 'style',
};
/* GET users listing. */
router.get('/', (req, res, next) => {
  productContrller.getAllProducts().then((prodects) => {
    admin.prodects = prodects;
    res.render('admin/products', { admin });
  });
});

router.get('/add-products', (req, res) => {
  res.render('admin/add-products', { admin: true });
});

router.post('/addProduct', (req, res) => {
  const image = req.files.file_img;
  productContrller.addProduct(req.body, image, (err) => {
    if (!err) res.render('admin/add-products', { admin: true });
    else console.log(err);
  });
});

router.get('/deleatProduct/:id', (req, res) => {
  const movieId = req.params.id;
  // const image = req.files.file_img;
  productContrller.deleteMovie(movieId).then((response) => {
    res.redirect('/admin/');
  });
});

router.get('/editProduct/:id', async (req, res) => {
  const itom = await productContrller.getOneItom(req.params.id);
  // console.log(itom);
  res.render('admin/edit-product', { itom });
});

router.post('/editProduct/:id', (req, res) => {
  const movieId = req.params.id;
  console.log(movieId);
  productContrller.updateItom(movieId, req.body);
  res.redirect('/admin/');
  const image = req.files.file_img;
  image.mv('public/images/products/' + movieId + '.jpeg');
});

module.exports = router;
