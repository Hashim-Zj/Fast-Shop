const db = require('./../config/connection');
const collections = require('./../config/cnstans');
const objectId = require('mongodb').ObjectID;
const fs = require('fs');



exports.addProduct = (product, image, next) => {
  console.log(product);
  db.get()
    .collection(collections.COLLECTION_PRODUCT)
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

exports.getAllProducts = async function () {
  const prodects = await db
    .get()
    .collection(collections.COLLECTION_PRODUCT)
    .find()
    .toArray();
  return prodects;
};

exports.getOneCatogary = async function (projection) {
  const prodects = await db
    .get()
    .collection(collections.COLLECTION_PRODUCT)
    .find(projection)
    .toArray();
  return prodects;
};

exports.getOneProduct = async function (itemId) {
  const item = await db
    .get()
    .collection(collections.COLLECTION_PRODUCT)
    .findOne({ _id: objectId(itemId) });
  return item;
};

exports.updateProduct = async function (itemId, DAta) {
  db.get()
    .collection(collections.COLLECTION_PRODUCT)
    .updateOne(
      { _id: objectId(itemId) },
      {
        $set: {
          Title: DAta.Title,
          ieomDiv: DAta.ieomDiv,
          Catogary: DAta.Catogary,
          Discription: DAta.Discription,
          Price: DAta.Price,
        },
      });
      return true;
};

exports.deleteProduct =async function (itemId) {
    db.get()
      .collection(collections.COLLECTION_PRODUCT)
      .deleteOne({ _id: objectId(itemId) })
      .then(async () => {
        fs.rm(
          `${__dirname}/./../public/images/products/${itemId }.jpeg`,
          (err, done) => {
            return(err);
          }
        );
      });
  return true;
};
