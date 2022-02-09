const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { existCategoryById, stateCategory } = require('../helpers/database-validators');

const { createCategory, getCategories, getCategoryById, deleteCategory, updateCategory } = require('../controllers/categories.controllers');


const router = Router();

router.route('/')
    .get(getCategories)
    .post([
        validateJWT,
        check('name', 'The name is required.').not().isEmpty(),
        check('user', 'The user is required.').not().isEmpty(),
        check('user', 'It is not a valid mongo id.').isMongoId(),
        validateFields
    ], createCategory);

router.route('/:id')
    .get([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existCategoryById),
        check('id').custom(stateCategory),
        validateFields
    ], getCategoryById)
    .put([
        validateJWT,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existCategoryById),
        check('id').custom(stateCategory),
        check('name', 'The name is required.').not().isEmpty(),
        validateFields
    ], updateCategory)
    .delete([
        validateJWT,
        isAdminRole,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('id').custom(existCategoryById),
        validateFields
    ], deleteCategory);


module.exports = router;