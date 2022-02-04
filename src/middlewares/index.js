const ValidateFields = require('../middlewares/validate-fields');
const ValidateJWT = require('../middlewares/validate-JWT');
const ValidateRoles = require('../middlewares/validate-roles');


module.exports = {
    ...ValidateFields,
    ...ValidateJWT,
    ...ValidateRoles
}