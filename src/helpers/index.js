const databaseValidators = require('./database-validators');
const fileUpload = require('./file-upload');
const generateJWT = require('./generate-JWT');
const googleVerify = require('./google-verify');


module.exports = {
    ...databaseValidators,
    ...fileUpload,
    ...generateJWT,
    ...googleVerify
}