const MongoClient = require('mongodb').MongoClient;
const state = {
  db: null,
};

module.exports.connect = (done) => {
  const url = 'mongodb://127.0.0.1:27017';
  const dbname = 'FastShop';

  MongoClient.connect(url, (err, data) => {
    if (err) return done(err);
    state.db = data.db(dbname);
    done();
  });
};

module.exports.get = () => state.db;


// const {mongoose} = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config({ path:`${__dirname}/../myConfig/config.env` });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log(con.connections);
//     console.log('Database Connection Successful 🎖');
//   })
//   .catch((err) => {
//     console.log(err);
//   console.log('Database Connection Failed 🥢');
// });
