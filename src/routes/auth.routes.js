const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth.controllers');

const { validateFields } = require('../middlewares/validate-fields');


const router = Router();


router.route('/login')
    .post([
        check('email', 'Email is required.').isEmail(),
        check('password', 'The password is required.').not().isEmpty(),
        validateFields
    ], login);

router.route('/google')
    .post([
        check('id_token', 'The google id_token is required.').not().isEmpty(),
        validateFields
    ], googleSignIn);

module.exports = router;