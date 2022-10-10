const db = require('./../config/connection');
const Data = require('./../config/cnstans');
const bcrypt = require('bcrypt');

exports.newLogin = (logData) => {
  return new Promise(async (resolve, reject) => {
    const logStatus = {
      logstatus: {},
      error: {
        errorMessage: {},
      },
    };

    if (logData.Name) {
      console.log('ghjkl;ghjkl;hjkl;');
      logStatus.logstatus.Name = true;
    } else {
      logStatus.logstatus.Name = false;
      logStatus.error.errorMessage.Name = 'Name field is required 📍';
    }

    if (logData.Email) {
      const isExist = await db
        .get()
        .collection(Data.COLLECTION_CLIENTS)
        .findOne(
          { Email: logData.Email, logType: logData.logType },
          { projection: { _id: 0, Email: 1 } }
        );
      if (isExist) {
        logStatus.logstatus.Email = false;
        logStatus.error.errorMessage.Email = 'This Email is alrady taken 📍';
      } else {
        logStatus.logstatus.Email = true;
      }
    } else {
      logStatus.logstatus.Email = false;
      logStatus.error.errorMessage.Email = 'Email is required 📍';
    }

    if (logData.logType === 'admin') {
      if (logData.key) {
        const Adminstrator = await db
          .get()
          .collection(Data.COLLECTION_CLIENTS)
          .findOne(
            { name: 'hashim', Type: 'administrator', email: '8606070595' },
            { projection: { _id: 0, Password: 1 } }
          );
        if (Adminstrator) {
          bcrypt.compare(logData.key, Adminstrator.Password).then((result) => {
            if (result) {
              logStatus.logstatus.adminKey = result;
            } else {
              logStatus.logstatus.adminKey = result;
              logStatus.error.errorMessage.key =
                'Enter correct security key 📍';
            }
          });
        } else {
          logStatus.logstatus.adminKey = false;
          logStatus.error.errorMessage.key =
            'Sorry Admin Registration Not Suporing .Try Next time📍';
        }
      } else {
        logStatus.logstatus.adminKey = false;
        logStatus.error.errorMessage.key = 'security key is required📍';
      }
    }

    if (logData.Password) {
      logData.Password = await bcrypt.hash(logData.Password, 10);
      logStatus.logstatus.Password = true;
    } else {
      logStatus.logstatus.Password = false;
      logStatus.error.errorMessage.Password = 'Password is required 📍';
    }
    let status;
    if (logData.logType === 'admin') {
      status =
        logStatus.logstatus['Name' && 'Email' && 'adminKey' && 'Password'];
    } else {
      status = logStatus.logstatus['Name' && 'Email' && 'Password'];
    }
    console.log(logStatus.logstatus['Name']);
    console.log(status);
    if (status) {
      logStatus.status = true;
      await db
        .get()
        .collection(Data.COLLECTION_CLIENTS)
        .insertOne(logData)
        .then((data) => {
          logStatus.InsrtedData = data;
          logStatus.Data = logData;
        });
      resolve(logStatus);
    } else {
      logStatus.status = false;
      resolve(logStatus);
    }
  });
};

exports.Login = (logData) => {
  return new Promise(async (resolve, reject) => {
    const user = await db
      .get()
      .collection(Data.COLLECTION_USER)
      .findOne({ Email: logData.Email, logType: logData.logType });
    const logStatus = {
      logstatus: false,
      errorMessage: {},
    };

    if (user) {
      bcrypt.compare(logData.password, user.password).then((result) => {
        if (result) {
          logStatus.user = user;
          logStatus.logstatus = result;
        } else {
          logStatus.errorMessage.Password = 'your Password not correct!📍';
        }
        logStatus.logstatus = result;
        resolve(logStatus);
      });
    } else {
      logStatus.errorMessage.Email = 'your EmailId is incorrect!📍';
      resolve(logStatus);
    }
  });
};
