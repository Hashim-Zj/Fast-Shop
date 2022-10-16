const express = require('express');
const router = express.Router();
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
    const clients = await clientsControlles.getAllClients('user')
    res.render('admin/users', { admin, clients });
  } else {
    res.redirect('/adminSignIn');
  }
});

// router.get('/users', async (req, res, next) => {
//   if (req.session.logedIn) {
//     admin.user = req.session.Body;
//     const clients = await clientsControlles.getAllClients('user')
//     res.render('admin/users', { admin, clients });
//   } else {
//     res.redirect('/adminSignIn');
//   }
// });

router.get('/admins', async (req, res) => {
  if (req.session.logedIn) {
    const clients = await clientsControlles.getAllClients('admin')
    res.render('admin/admins', { admin, clients });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/editUser/:id', async (req, res) => {
  if (req.session.logedIn) {
    const userId = req.params.id;
    const user = await clientsControlles.getOneUser({ _id: objectId(userId), logType: 'user' });

    res.render('admin/editUser', { admin, user });
  } else {
    res.redirect('/adminSignIn');
  }
});

// WARN POST
router.post('/editUser/:id', async (req, res) => {
  const userId = req.params.id;
  await clientsControlles.editOneUser(userId, req.body);
  res.redirect('/users');
})

router.post('/deleatUser/:id', async (req, res) => {
  const userId = req.params.id;
  await clientsControlles.deleteOneUser(userId);
  res.redirect('/users');
})

router.post('/findUser', async (req, res) => {
  const userId = req.params.id;
  await clientsControlles.editOneUser(userId, req.body);
  res.redirect('/users');
})


  // / admin /
router.get('/All', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getAllProducts()
    admin.prodects = prodects;
    res.render('admin/products', { admin });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Electronics', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics')
    admin.prodects = prodects;
    res.render('admin/products', { admin });
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/vegetables', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics')
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});


router.get('/Grocery', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics')
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Books', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics')
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/Movies', async (req, res) => {
  if (req.session.logedIn) {
    const prodects = await adminControlles.getOneCatogary('Elactronics')
    admin.prodects = prodects;
  } else {
    res.redirect('/adminSignIn');
  }
});

router.get('/add-products', async (req, res) => {
  if (req.session.logedIn) {
  res.render('admin/add-products', { admin: true });
  }
});

router.post('/addProduct', async (req, res) => {
  const image = req.files.file_img;
  await adminControlles.addProduct(req.body, image, (err) => {
    if (!err) res.render('admin/add-products', { admin: true });
    else console.log(err);
  });
});

router.get('/deleatProduct/:id', async (req, res) => {
  if (req.session.logedIn) {
  const movieId = req.params.id;
  // const image = req.files.file_img;
    await adminControlles.deleteMovie(movieId).then((response) => {
    res.redirect('/admin/');
  });
  }
});

router.get('/editProduct/:id', async (req, res) => {
  if (req.session.logedIn) {
    const item = await adminControlles.getOneItem(req.params.id);
    // console.log(item);
    res.render('admin/edit-product', { item });
  }
});

router.post('/editProduct/:id', async (req, res) => {
  const movieId = req.params.id;
  console.log(movieId);
  await adminControlles.updateItom(movieId, req.body);
  res.redirect('/admin/');
  const image = req.files.file_img;
  image.mv('public/images/products/' + movieId + '.jpeg');
});

module.exports = router;
