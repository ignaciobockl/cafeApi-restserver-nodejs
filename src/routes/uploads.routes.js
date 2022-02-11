const { Router } = require('express');
const { check } = require('express-validator');

const {
    filesUploads,
    updateImage,
    showImage,
    updateImageCloudinary,
    showImageCloudinary
} = require('../controllers/uploads.controllers');

const { allowedCollections } = require('../helpers');

const { validateFields, validateFileUpload } = require('../middlewares');


const router = Router();


router.route('/')
    .post([
        validateFileUpload,
        validateFields
    ], filesUploads);

router.route('/:collection/:id')
    .put([
        validateFileUpload,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
        validateFields
    ], updateImage)
    .get([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
        validateFields
    ], showImage);

router.route('/cloud/:collection/:id')
    .put([
        validateFileUpload,
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
        validateFields
    ], updateImageCloudinary)
    .get([
        check('id', 'It is not a valid mongo id.').isMongoId(),
        check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
        validateFields
    ], showImageCloudinary);


module.exports = router;