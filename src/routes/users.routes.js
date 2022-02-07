const { Router } = require('express');
const { check } = require('express-validator');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-JWT');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares/index');

const { isRoleValid, existEmail, existUserById, stateUser } = require('../helpers/database-validators');

const {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/users.controllers');


const router = Router();

router.route('/')
    .get(getUsers)
    .post([
        check('name', 'The name is required..').not().isEmpty(),
        check('email', 'The email is not valid.').isEmail(),
        check('email').custom(existEmail),
        check('password', 'The password must have a minimum of 6 characters and a maximum of 15 characters.').isLength({ min: 6, max: 15 }),
        // check('role', 'It is not a valid role.').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom(role => isRoleValid(role)),
        validateFields
    ], createUser);

router.route('/:id')
    .get([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(stateUser),
        check('id').custom(existUserById),
        validateFields
    ], getUserById)
    .put([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(stateUser),
        check('id').custom(existUserById),
        check('role').custom(isRoleValid),
        validateFields
    ], updateUser)
    .delete([
        validateJWT,
        isAdminRole,
        // hasRole('ADMIN_ROLE', 'VENTAS_ROLE'), /* it is the same middleware as isAdminRole with the difference that it can be customized. */
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existUserById),
        validateFields
    ], deleteUser);



module.exports = router;