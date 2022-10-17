const express = require('express');
const router = express.Router();
const objectId = require('mongodb').ObjectID;
const adminControlles = require('./../controller/adminControlles');
const clientsControlles = require('./../controller/clientsControlles');
const admin = {
  admin: true,
  style: 'style',
};

/* GET users listing. */
router.get('/', async (req, res, next) => {
  if (req.session.logedIn) {
    admin.user = req.session.Body;
    const clients = await clientsControlles.getAllClients('user');
    res.render('admin/users', { admin, clients, sercherr });
  } else {
    res.redirect('/adminSignIn');
  }
  sercherr = null;
});


router.get('/admins', async (req, res) => {
  if (req.session.logedIn) {
    const clients = await clientsControlles.getAllClients('admin');
    res.render('admin/admins', { admin, clients });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/editUser/:id', async (req, res) => {
  if (req.session.logedIn) {
    const userId = req.params.id;
    const arg = { _id: objectId(userId), logType: 'user' };
    const user = await clientsControlles.getOneUser(arg);

    res.render('admin/editUser', { admin, user });
  } else {
    res.redirect('/adminSignIn');
  }
});

// FFF POST
router.post('/editUser/:id', async (req, res) => {
  const userId = req.params.id;
  console.log('user edited');
  console.log(req.body);
  await clientsControlles.editOneUser(userId, req.body);
  res.redirect('/admin/');
});

router.get('/deleatUser/:id', async (req, res) => {
  const userId = req.params.id;
  await clientsControlles.deleteOneUser(userId);
  res.redirect('/admin/');
});

let sercherr = null;
router.post('/findUser', async (req, res) => {
  console.log(req.body);
  const projection = { Name: req.body.search, logType: 'user' };
  const user = await clientsControlles.getOneUser(projection);
  const clients = []
  clients.push(user);
  if (clients) {
    console.log(clients);
    res.render('admin/users', { admin, clients });
  } else {
    sercherr = true;
    res.redirect('/admin/');
  }

});

// router.post('/findAdmin', async (req, res) => {
//   const projection = { Name: req.body.search, logType: 'admin' };
//   console.log(req.body);
//   const user = await clientsControlles.getOneUser(projection);
//   const clients = []
//   clients.push(user);
//   console.log(clients);
//   if (clients) {
//     console.log(clients);
//     res.render('admin/admins', { admin, clients });
//   }else{
//     sercherr = true;
//     res.redirect('/admin/admins');
//   }
// });

router.get('/All', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getAllProducts();
    res.render('admin/products', { admin ,prodects});
  } else {
    res.redirect('/adminSignIn');
  }
});


router.get('/add-products', async (req, res) => {
  if (req.session.logedIn) {
    res.render('admin/add-products', { admin });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.post('/addProduct', async (req, res) => {
  const image = req.files.file_img;
  await adminControlles.addProduct(req.body, image, (err) => {
    if (!err) res.redirect('/admin/All');
    else console.log(err);
  });
});

router.get('/deleatProduct/:id', async (req, res) => {
  if (req.session.logedIn) {
    await adminControlles.deleteProduct(req.params.id);
    res.redirect('/admin/All');
  }
});


router.get('/editProduct/:id', async (req, res) => {
  if (req.session.logedIn) {
    const product = await adminControlles.getOneProduct(req.params.id);
    res.render('admin/edit-product', { admin, product });
  }
});

router.post('/editProduct/:id', async (req, res) => {
  // const movieId = req.params.id;
  // console.log(movieId);
  await adminControlles.updateProduct(req.params.id, req.body);
  res.redirect('/admin/');
  const image = req.files.file_img;
  image.mv('public/images/products/' + req.params.id + '.jpeg');
});



router.get('/Electronics', async (req, res) => {
  if (req.session.logedIn) {
    const catogary = 'Elactronics'
    const prodects = await adminControlles.getOneCatogary(catogary);
    admin.prodects = prodects;
    res.render('admin/products', { admin });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/vegetables', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics');
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Grocery', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics');
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Books', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics');
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Movies', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics');
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});
module.exports = router;
