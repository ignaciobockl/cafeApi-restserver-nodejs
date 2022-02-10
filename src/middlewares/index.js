const ValidateFields = require('../middlewares/validate-fields');
const ValidateFile = require('../middlewares/validate-file');
const ValidateJWT = require('../middlewares/validate-JWT');
const ValidateRoles = require('../middlewares/validate-roles');


module.exports = {
    ...ValidateFields,
    ...ValidateFile,
    ...ValidateJWT,
    ...ValidateRoles
}