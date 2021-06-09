const jwt = require('jsonwebtoken');
const commandLineArgs = require('command-line-args')
require('dotenv').config();

//Retreives the private signing key for the JWT from the envrionment
const privateKey = process.env.JWT_PRIVATE_KEY;

//Uses command line arguements to create a json input to a JWT signer
//Currently Supports: userInfoID, userMainID, admin
const optionDefinitions = [
  { name: 'userInfoID', alias: 'i', type: Number },
  { name: 'userMainID', alias: 'm', type: Number },
  { name: 'admin', alias: 'a', type: String }
]

//Configures the expected input
const options = commandLineArgs(optionDefinitions)

//Sign and print JWT
console.log("JWT:", jwt.sign(options, privateKey))
