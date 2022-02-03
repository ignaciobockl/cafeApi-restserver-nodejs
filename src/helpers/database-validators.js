const Role = require('../models/role.model');
const User = require('../models/user.model');


const isRoleValid = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`The entered role does not exist in the database. Role entered: ${ role }`);
    }
}


/**
 *  Email validators
 */
const existEmail = async(email = '') => {
    const exist = await User.findOne({ email });
    if (exist) {
        throw new Error(`The email ${ email } is already registered in the database.`);
    }
}


/**
 *  User validators
 */
const existUserById = async(id) => {
    const exist = await User.findById(id);
    if (!exist) {
        throw new Error('There is no user with the entered id.');
    }
}

const stateUser = async(id) => {
    const user = await User.findById(id);
    if (user.state === false) {
        throw new Error('The user is deleted.');
    }
}


module.exports = {
    isRoleValid,
    existEmail,
    existUserById,
    stateUser
}