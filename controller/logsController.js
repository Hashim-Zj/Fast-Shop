const db = require('./../config/connection');
const Data = require('./../config/cnstans');
const bcrypt = require('bcrypt');

const logStatus = { errMsg: {} };

//TODO SIGNUP
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

exports.newLogin = async function (logData) {
  // logStatus =null;
  logStatus.status = false;
  logStatus.errMsg = {
    pass: false,
    email: false,
  };
  if (await isEmailExist(logData.Email, logData.logType)) {
    logStatus.errMsg.email = 'This Email is alrady taken';
    console.log('ERROR WMAIL');
    console.log(logStatus);
    return logStatus;
  }
  if (logData.logType === 'admin') {
    if (!(await sudoCmp(logData.key))) {
      console.log('WARN security');
      console.log(logStatus);
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
  console.log('VIDEO');
  console.log(logStatus);
  return logStatus;
};

// exports.newLogin = (logData) => {
//   return new Promise(async (resolve, reject) => {
//     logStatus.status = false;
//     if (await isEmailExist(logData.Email, logData.logType)) {
//       logStatus.errMsg.email = 'This Email is alrady taken';
//     } else {
//       if (logData.logType === 'admin') {
//         // const Administrator = getAdministrator();
//         const Administrator = 'HashimZjH';
//         // const passwordMatch = await bcrypt.compare(
//         // logData.key,
//         // Administrator.Password
//         // );
//         // bcrypt.compare(logData.key, Administrator.Password).then((result) => {
//         // if (passwordMatch) {
//         if (Administrator === logData.key) {
//           logStatus.status = true;
//           delete logData.key;
//         } else logStatus.errMsg.pass = "The security key isn't correct";
//         // });
//         // } else
//         //   logStatus.errMsg.pass =
//         //     'Sorry admin registration not suport! try next time';
//       } else {
//         logStatus.status = true;
//       }
//     }
//     if (logStatus.status) {
//       console.log('++++++++++++++++++++++++++++++++');
//       logData.Password = await bcrypt.hash(logData.Password, 10);
//       await db
//         .get()
//         .collection(Data.COLLECTION_CLIENTS)
//         .insertOne(logData)
//         .then((data) => {
//           logStatus.Body = logData;
//         });
//     }
//     resolve(logStatus);
//   });
// };


//TODO SIGNIN
async function userFind(logData) {
  const user = await db
    .get()
    .collection(Data.COLLECTION_CLIENTS)
    .findOne({ Email: logData.Email, logType: logData.logType });
  return user;
}

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

// WARN FFF ERROR BUG VIDEO
