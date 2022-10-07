const db = require('./../config/connection');
const const_data = require('./../config/cnstans');

module.exports = {
  addProduct: (product, next) => {
    console.log(product);
    db.get()
      .collection(const_data.COLLECTION_PRODUCT)
      .insertOne(product)
      .then((data) => {
        console.log(data);
        next(data.insertedId);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let prodects = await 
      db.get()
        .collection(const_data.COLLECTION_PRODUCT)
        .find()
        .toArray();
      resolve(prodects);
    });
  }
};
