const db = require('./../config/connection');
const Data = require('./../config/cnstans');
const bcrypt = require('bcrypt');

let logStatus = { errMsg: {} };

async function isEmailExist(email, type) {
  const sudoEmail = await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .findOne(
      { Email: email, logType: type },
      { projection: { _id: 0, Email: 1 } }
  );
  if (sudoEmail) {
    return true;
  } else return false;
}

async function getAdministrator() {
  const Adminstrator = await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .findOne(
      { name: 'hashim', Type: 'administrator' },
      { projection: { _id: 0, Password: 1 } }
  ); 
  return Adminstrator;
}

async function sudoCmp(Password) {
  const superAdmin = await getAdministrator();
  if (superAdmin) {
    if (await bcrypt.compare(Password, superAdmin.Password)) {
      logStatus.status = true;
      return true;
    }
    logStatus.errMsg.pass = "The security key isn't correct";
    return false;
  }
  logStatus.errMsg.pass = 'Sorry admin registration not suport! try next time';
  return false;
}

// EDIT SIGNUP
exports.newLogin = async function (logData) {
  logStatus.status = false;
  logStatus.errMsg = {
    pass: false,
    email: false,
  };
  if (await isEmailExist(logData.Email, logData.logType)) {
    logStatus.errMsg.email = 'This Email is alrady taken';
    return logStatus;
  }
  if (logData.logType === 'admin') {
    if (!(await sudoCmp(logData.key))) {
      return logStatus;
    }
    delete logData.key;
  }
  logStatus.status = true;
  logData.Password = await bcrypt.hash(logData.Password, 10);
  await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .insertOne(logData)
    .then((data) => {
      logStatus.Body = logData;
    });
  return logStatus;
};

async function userFind(logData) {
  const user = await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .findOne({ Email: logData.Email, logType: logData.logType });
  return user;
}

// EDIT SIGNIN
exports.Login = async function (logData) {
  logStatus.status = false;
  logStatus.errMsg = {
    logPass: false,
    logEmail: false,
  };
  const user = await userFind(logData);
  if (user) {
    const pasState = await bcrypt.compare(logData.Password, user.Password);
    if (pasState) {
      logStatus.status = true;
      logStatus.Body = user;
      return logStatus;
    }
    logStatus.errMsg.logPass = "Your password isn't correct";
    return logStatus;
  }
  logStatus.errMsg.logEmail = 'This user not found!';
  return logStatus;
};
