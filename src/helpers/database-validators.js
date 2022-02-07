const { Category, Role, User } = require('../models');


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
    if (!exist) { throw new Error('There is no user with the entered id.') }
}

const stateUser = async(id) => {
    const user = await User.findById(id);
    if (user.state === false) { throw new Error('The user is deleted.') }
}

/**
 *  Category validators
 */
const existCategoryById = async(id) => {
    const exist = await Category.findById(id);
    if (!exist) { throw new Error('There is no category with the entered id.') }
}

const stateCategory = async(id) => {
    const category = await Category.findById(id);
    if (category.state === false) { throw new Error('The category is deleted.') }
}

module.exports = {
    isRoleValid,
    existEmail,
    existUserById,
    stateUser,
    existCategoryById,
    stateCategory
}