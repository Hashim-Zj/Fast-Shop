// 'use strict';


// function nameValidater(name) {
//   if (validator.isEmpty(name)) {
//     logStatus.errMsg.name = 'Enter your name';
//     return false;
//   } else if (!validator.isAlphanumeric(name)) {
//     logStatus.errMsg.name = 'No spesial characters allowed';
//     return false;
//   } else {
//     logStatus.errMsg.name = false;
//     return true;
//   }
// }



// function emailValidater(email, type) {
//   if (validator.isEmpty(email, { ignore_whitespace: true })) {
//     logStatus.errMsg.email = 'Enter your email';
//     return false;
//   } else if (!validator.isEmail(email)) {
//     logStatus.errMsg.email = 'Please correct your email format';
//     return false;
//   } else if (!isExist(email, type)) {
//     logStatus.errMsg.email = 'This Email is alrady taken';
//     return false;
//   } else {
//     logStatus.errMsg.email = false;
//     return true;
//   }
// }


// function phoneValidater(phone) {
//   const length = phone.length;
//   if (!validator.isNumeric(phone) && !validator.isEmpty(phone)) {
//     logStatus.errMsg.phone = 'Only numbers allowed';
//     return false;
//   } else if (length !== 10 && !validator.isEmpty(phone)) {
//     logStatus.errMsg.phone = 'The phone number should have 10 digit';
//     return false;
//   } else {
//     logStatus.errMsg.phone = false;
//     return true;
//   }
// }


// function passwordValidater(pass) {
//   const length = pass.length;
//   if (validator.isEmpty(pass)) {
//     console.log('is empty of password');
//     logStatus.errMsg.pass = 'Enter a password';
//     return false;
//   } else if (!(length >= 8 && length <= 12)) {
//     console.log('islength');

//     logStatus.errMsg.pass = 'length of password must include 8-12';
//     return false;
//   } else {
//     logStatus.errMsg.pass = false;
//     return true;
//   }
// }


// if (validator.isEmpty(key)) {
//   logStatus.errMsg.key = 'Enter security key';
//   return false;
// } else {








//   function logEmailVlidate(Email) {
//     if (validator.isEmpty(Email, { ignore_whitespace: true })) {
//       logStatus.errMsg.email = 'Enter your email';
//       return false;
//     } else if (!validator.isEmail(Email)) {
//       logStatus.errMsg.email = 'Please correct your email format';
//       return false;
//     } else return true;
//   }










//   function logPassValidate(pass) {
//     if (validator.isEmpty(pass)) {
//       logStatus.errMsg.pass = 'Enter your password';
//       return false;
//     } else return true;
//   }
