const { Router } = require('express');
const { check } = require('express-validator');

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/products.controllers');

const { existProductById, stateProduct } = require('../helpers/database-validators');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');


const router = Router();


router.route('/')
    .get(getProducts)
    .post([
        check('name', 'The name is required.').not().isEmpty(),
        check('user', 'The user is required.').not().isEmpty(),
        check('user', 'It is not a valid mongo id.').isMongoId(),
        // check('price', 'Decimal expected.').isDecimal(),
        check('category', 'The category is required.').not().isEmpty(),
        check('category', 'It is not a valid mongo id.').isMongoId(),
        // check('description', 'String expected.').isString(),
        // check('available', 'Boolean value ( true or false ) expected.').isBoolean(),
        validateFields
    ], createProduct);

router.route('/:id')
    .get([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existProductById),
        check('id').custom(stateProduct),
        validateFields
    ], getProductById)
    .put([
        validateJWT,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existProductById),
        check('id').custom(stateProduct),
        validateFields
    ], updateProduct)
    .delete([
        validateJWT,
        isAdminRole,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existProductById),
        validateFields
    ], deleteProduct);


module.exports = router;