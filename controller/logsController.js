const db = require('./../config/connection');
const Data = require('./../config/cnstans');
const bcrypt = require('bcrypt');
const validator = require('validator');

const logStatus = {
  errMsg: {
    name: false,
    email: false,
    phone: false,
    key: false,
    pass: false,
  },
};

async function isExist(email, type) {
  const dbEmail = await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .findOne(
      { Email: email, logType: type },
      { projection: { _id: 0, Email: 1 } }
    );
  console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{');
  console.log(dbEmail);
  const com = dbEmail.Email
  if (email === com) {
    return true;
  } else return false;
}

function PassCompare(pass, dbPass) {
  bcrypt.compare(pass, dbPass).then((result) => {
    return result;
  });
}

function nameValidater(name) {
  if (validator.isEmpty(name)) {
    logStatus.errMsg.name = 'Enter your name';
    return false;
  } else if (!validator.isAlpha(name)) {
    logStatus.errMsg.name = 'Only [a-zA-Z] letters are allowed';
    return false;
  } else {
    return true;
  }
}

function emailValidater(email, type) {
  if (validator.isEmpty(email, { ignore_whitespace: true })) {
    logStatus.errMsg.email = 'Enter your email';
    return false;
  } else if (!validator.isEmail(email)) {
    logStatus.errMsg.email = 'Please correct your email format';
    return false;
  } else if (isExist(email, type)) {
    logStatus.errMsg.email = 'This Email is alrady taken';
    return false;
  } else {
    return true;
  }
}

function phoneValidater(phone) {
  const length = phone.length;
  if (!validator.isNumeric(phone) && !(validator.isEmpty(phone))) {
    logStatus.errMsg.phone = 'Only numbers allowed';
    return false;
  } else if ((length !== 10) && !(validator.isEmpty(phone))) {
    logStatus.errMsg.phone = 'The phone number should have 10 digit';
    return false;
  } else {
    return true;
  }
}

function isAdmin(admin) {
  if (admin === 'admin') return true;
  else return false;
}

async function keyValidater(key) {
  if (validator.isEmpty(key)) {
    logStatus.errMsg.key = 'Enter security key';
    return false;
  } else {
    const Adminstrator = await db
      .get()
      .collection(Data.COLLECTION_CLIENTS)
      .findOne(
        { name: 'hashim', Type: 'administrator', email: '8606070595' },
        { projection: { _id: 0, Password: 1 } }
      );
    if (Adminstrator) {
      if (PassCompare(key, Adminstrator.Password)) return true;
      else {
        logStatus.errMsg.key = "The security key isn't correct";
        return false;
      }
    } else {
      logStatus.errMsg.key =
        'Sorry admin registration not suport! try next time';
      return false;
    }
  }
}

function passwordValidater(pass) {
  const length = pass.length;
  if (validator.isEmpty(pass)) {
    logStatus.errMsg.pass = 'Enter a password';
    return false;
  } else if (!(length >= 8 && length <= 12)) {
    logStatus.errMsg.pass = 'length of password must include 8-12';
    return false;
  }
  else return true;
}

exports.newLogin = (logData) => {
  return new Promise(async (resolve, reject) => {
    nameValidater(logData.Name);
    emailValidater(logData.Email, logData.logType);
    phoneValidater(logData.Phone);
    if (isAdmin(logData.logType)) {
      keyValidater(logData.key); 
    }
    passwordValidater(logData.Password);
    if (isAdmin(logData.logType)) {
      finalStatus =
        nameValidater(logData.Name) &&
        emailValidater(logData.Email, logData.logType) &&
        phoneValidater(logData.Phone) &&
        keyValidater(logData.key) &&
        passwordValidater(logData.Password);
    } else {
      finalStatus =
        nameValidater(logData.Name) &&
        emailValidater(logData.Email) &&
        phoneValidater(logData.Phone) &&
        passwordValidater(logData.Password);
    }
    console.log('+++++++++++++++++++++++++++++++++++++++++++++');
    console.log(finalStatus);

    if (finalStatus) {
      logData.Password = await bcrypt.hash(logData.Password, 10);
      await db
        .get()
        .collection(Data.COLLECTION_CLIENTS)
        .insertOne(logData)
        .then((data) => {
          logStatus.status = true;
          logStatus.Body = logData;
        });
    } else logStatus.status = false;
    resolve(logStatus);
  });
};

function logEmailVlidate(Email) {
  if (validator.isEmpty(Email, { ignore_whitespace: true })) {
    logStatus.errMsg.email = 'Enter your email';
    return false;
  } else if (!validator.isEmail(Email)) {
    logStatus.errMsg.email = 'Please correct your email format';
    return false;
  } else return true;
}

function logPassValidate(pass) {
  if (validator.isEmpty(pass)) {
    logStatus.errMsg.pass = 'Enter your password';
    return false;
  } else return true;
}

async function userFind(logData) {
  const user = await db
    .get()
    .collection(Data.COLLECTION_USER)
    .findOne({ Email: logData.Email, logType: logData.logType });
  if (user) return user;
  else return false;
}

exports.Login = (logData) => {
  return new Promise(async (resolve, reject) => {
    if (
      !(logEmailVlidate(logData.Email) && logPassValidate(logData.Password))
    ) {
      logStatus.status = false;
    } else {
      const user = userFind(logData);
      if (user) {
        if (PassCompare(logData.Password, user.Password)) {
          logStatus.Body = user;
          logStatus.status = true;
        } else {
          logStatus.errMsg.pass = "The password isn't macheing";
          logStatus.status = false;
        }
      } else {
        logStatus.status = false;
        logStatus.errMsg.email = 'This user not found!';
      }
    }
    resolve(logStatus);
  });
};


