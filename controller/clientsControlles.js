const db = require('./../config/connection');
const collections = require('./../config/cnstans');
const objectId = require('mongodb').ObjectID;

exports.getAllClients = async function (type) {
  const users = await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .find({ logType: type })
    .toArray();
  return users;
};

exports.getOneUser = async function (projection) {
  const user = await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .findOne(projection);
  console.log('this id user');
  console.log(user);
  return user;
};

exports.editOneUser = async function (userId, Data) {
  await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .updateOne(
      { _id: objectId(userId) },
      {
        $set: {
          Name: Data.Name,
          Email: Data.Email,
          Phone: Data.Phone,
          logType: Data.logType,
        },
      }
    );
  return true;
};

exports.deleteOneUser = async function (userId) {
  await db
    .get()
    .collection(collections.COLLECTION_CLIENTS)
    .deleteOne({ _id: objectId(userId) });
  return true;
};
