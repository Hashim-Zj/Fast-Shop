const db = require('./../config/connection');
const collections = require('./../config/cnstans');
const objectId = require('mongodb').ObjectID;
const fs = require('fs');

exports.getAllClients = async function (type) {
  const users = await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .find({ logType: type })
    .toArray();
  return users;
};


exports.getOneUsers = async function (userId) {
  const user = await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .find({ _id: userId, logType: 'user' })
    .toArray();
  return user;
};

exports.editOneUser = async function (userId, Data) {
  db.get()
    .collection(collections.COLLECTION_CLIENTS)
    .updateOne(
      { _id: objectId(userId) },
      {
        $set: {
          Name: DAta.Name,
          Email: DAta.Email,
          Phone: DAta.Phone,
          logType: DAta.logType,
        },
      });
};

exports.deleteOneUser = function (userId) {
  db.get()
    .collection(collections.COLLECTION_CLIENTS)
    .deleteOne({ _id: objectId(userId) });
};



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

exports.getOneCatogary = async function (ieomDiv) {
  const prodects = await db
    .get()
    .collection(collections.COLLECTION_PRODUCT)
    .find({ ieomDiv: ieomDiv })
    .toArray();
  return prodects;
};

exports.getOneItem = async function (itemId) {
  const item = await db
    .get()
    .collection(collections.COLLECTION_PRODUCT)
    .findOne({ _id: objectId(itemId) });
  return item;
};

exports.updateItem = async function (itemId, DAta) {
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
      }
    );
};

exports.deleteMovie = (itemId) => {
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collections.COLLECTION_PRODUCT)
      .deleteOne({ _id: objectId(itemId) })
      .then(async () => {
        fs.rm(
          `${__dirname}/public/images/products/` + itemId + '.jpeg',
          (err, done) => {
            resolve(err);
          }
        );
      });
  });
};
