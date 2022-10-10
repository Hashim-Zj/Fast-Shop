const db = require('./../config/connection');
const const_data = require('./../config/cnstans');
const objectId = require('mongodb').ObjectID;

exports.addProduct = (product, image, next) => {
  console.log(product);
  db.get()
    .collection(const_data.COLLECTION_PRODUCT)
    .insertOne(product)
    .then((data) => {
      image.mv(
        'public/images/products/' + data.insertedId + '.jpeg',
        (err, done) => {
          next(err);
        }
      );
    });
};

exports.getAllProducts = () => {
  return new Promise(async (resolve, reject) => {
    const prodects = await db
      .get()
      .collection(const_data.COLLECTION_PRODUCT)
      .find()
      .toArray();
    resolve(prodects);
  });
};

exports.getOneItom = (movieId) => {
  return new Promise(async (resolve, reject) => {
    const itom = await db
      .get()
      .collection(const_data.COLLECTION_PRODUCT)
      .findOne({ _id: objectId(movieId) });
    resolve(itom);
  });
};

exports.updateItom = (movieId, movieDAta) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(const_data.COLLECTION_PRODUCT)
      .updateOne(
        { _id: objectId(movieId) },
        {
          $set: {
            title: movieDAta.title,
            catogary: movieDAta.catogary,
            discription: movieDAta.discription,
            price: movieDAta.price,
          },
        }
      );
  });
};

exports.deleteMovie = (movieId) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(const_data.COLLECTION_PRODUCT)
      .deleteOne({ _id: objectId(movieId) })
      .then(async () => {
        fs.rm('public/images/products/' + movieId + '.jpeg', (err, done) => {
          resolve(err);
        });
      });
  });
};
