const { request, response } = require("express");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

const { User, Product } = require("../models");

const { fileUpload } = require('../helpers');

// cloudinary configuration
cloudinary.config(process.env.CLOUDINARY_URL);


const filesUploads = async(req = request, res = response) => {

    try {
        // const fullPath = await fileUpload(req.files, ['txt', 'md'], 'texts');
        const fullPath = await fileUpload(req.files, undefined, 'imgs');
        return res.status(200).json({ ok: true, path: fullPath });
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const updateImage = async(req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no user in the database with the entered id.' }) }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no product in the database with the entered id.' }) }
            break;

        default:
            return res.status(500).json({ ok: false, errorMsg: 'Missing to make collections allowed.' });
    }

    try {
        if (model.img) {
            //delete image from server
            const pathImg = path.join(__dirname, '../../uploads', collection, model.img);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

    // random image name - uuid
    const nameFile = await fileUpload(req.files, undefined, collection);
    const aux = nameFile.split(`\\`);
    const auxLength = aux.length;
    const aux2 = aux[auxLength - 1];

    // model.img = nameFile;
    model.img = aux2;
    await model.save();
    return res.status(200).json({ ok: true, model });

}

const showImage = async(req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no user in the database with the entered id.' }) }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no product in the database with the entered id.' }) }
            break;

        default:
            return res.status(500).json({ ok: false, errorMsg: 'Missing to make collections allowed.' });
    }

    try {
        if (model.img) {
            const pathImg = path.join(__dirname, '../../uploads', collection, model.img);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg);
            }
        }
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

    const pathImage = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathImage);

}

const updateImageCloudinary = async(req = request, res = response) => {

    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no user in the database with the entered id.' }) }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no product in the database with the entered id.' }) }
            break;

        default:
            return res.status(500).json({ ok: false, errorMsg: 'Missing to make collections allowed.' });
    }

    try {
        if (model.img) {
            //delete image from Cloudinary.
            const aux = model.img.split(`/`);
            const aux2 = aux[aux.length - 1];
            const [public_id] = aux2.split('.');
            await cloudinary.uploader.destroy(`CafeDbCloudinary/${collection}/${public_id}`);
        }
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `CafeDbCloudinary/${collection}` });
    model.img = secure_url;
    await model.save();
    return res.status(200).json({ ok: true, model });

}

const showImageCloudinary = async(req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no user in the database with the entered id.' }) }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) { return res.status(400).json({ ok: false, errorMsg: 'There is no product in the database with the entered id.' }) }
            break;

        default:
            return res.status(500).json({ ok: false, errorMsg: 'Missing to make collections allowed.' });
    }

    try {
        if (model.img) {
            const path = model.img;
            return res.sendFile(path);
        }
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}


module.exports = {
    filesUploads,
    showImage,
    showImageCloudinary,
    updateImage,
    updateImageCloudinary
}