const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");

const { Product, Category, User } = require('../models');


const createProduct = async(req = request, res = response) => {

    const { name, user, category } = req.body;
    let { price, description, available } = req.body;
    const nameUp = name.toUpperCase();

    // check if the category exists in the database
    const productDB = await Product.findOne({ name });
    if (productDB) { return res.status(400).json({ ok: false, msg: `The product ${ name } already exists in the database.` }) }

    // validate price
    if (price === undefined) { price = 0.00 } else if (typeof(price) !== 'number') { return res.status(400).json({ ok: false, msg: `Decimal value expected.`, price }) }
    // validate description
    if (description === undefined) { description = "" } else if (typeof(description) !== 'string') { return res.status(400).json({ ok: false, msg: `String value expected.`, description }) }
    // validate available
    if (available === undefined) { available = true } else if (typeof(available) !== 'boolean') { return res.status(400).json({ ok: false, msg: `Boolean value expected.`, available }) }

    // generate the data to save
    const data = {
        name: nameUp,
        state: true,
        user,
        price,
        category,
        description,
        available
    }
    const product = new Product(data);

    // save to database
    await product.save();
    return res.status(201).json({ ok: true, msg: `The Product was created successfully.`, product });


}

const getProducts = async(req = request, res = response) => {

    const { from = 0, limit = 10 } = req.query;

    // Validate the values entered by query 'from' and 'limit'.
    if (Number(from).toString() === 'NaN') { return res.status(400).json({ ok: false, msg: `Invalid data type ('from'), expected number.` }) }
    if (Number(limit).toString() === 'NaN') { return res.status(400).json({ ok: false, msg: `Invalid data type ('limit'), expected number.` }) }

    try {

        const [totalProducts, products] = await Promise.all([
            Product.countDocuments({ state: true }),
            Product.find({ state: true })
            .limit(limit)
            .skip(from)
            .populate('user', '_id name email role')
            .populate('category', '_id name')
        ]);

        // check if there are categories in the database
        if (totalProducts === 0) { return res.status(400).json({ ok: false, msg: 'There are no products in the database.' }) }

        return res.status(200).json({ ok: true, quantity: totalProducts, products });

    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const getProductById = async(req = request, res = response) => {

    const id = req.params.id;

    try {
        const product = await Product.findById(id).populate('user', '_id name email role').populate('category', '_id name');
        return res.status(200).json({ ok: true, product });
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const updateProduct = async(req = request, res = response) => {

    const id = req.params.id;
    const { state, user, ...data } = req.body;

    data.user = req.user._id;

    const product = await Product.findById(id).populate('user', '_id name email role').populate('category', '_id name');
    if (!product) { return res.status(400).json({ ok: false, msg: 'There is no product with the entered id.' }) }

    //validated user
    // try {
    //     const userDb = await User.findById(data.user);
    //     if (userDb) { if (isValidObjectId(userDb._id)) { data.user = userDb._id; } }
    // } catch (error) {
    //     return res.status(400).json({ ok: false, error });
    // }
    // validated category
    try {
        const categoryDb = await Category.findById(data.category);
        if (categoryDb) { if (isValidObjectId(categoryDb._id)) { data.category = categoryDb._id; } }
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }
    // validated name
    if (data.name !== undefined) {
        if (typeof(data.name) !== 'string') { return res.status(400).json({ ok: false, msg: `String value expected.`, name: data.name }) }
        data.name = data.name.toUpperCase();
    }
    // valedated price
    if (data.price !== undefined) {
        if (product.price !== data.price) {
            if (typeof(data.price) !== 'number') { return res.status(400).json({ ok: false, msg: `Decimal value expected.`, product: product.price }) }
        }
    }
    // validated description
    if (data.description !== undefined) {
        if (product.description !== data.description) {
            if (typeof(data.description) !== 'string') { return res.status(400).json({ ok: false, msg: `String value expected.`, description: data.description }) }
        }
    }
    // validated available
    if (data.available !== undefined) {
        if (product.available !== data.available) {
            if (typeof(data.available) !== 'boolean') { return res.status(400).json({ ok: false, msg: `Boolean value expected.`, available: data.available }) }
        }
    }

    try {
        const update = await Product.findByIdAndUpdate(id, data, { new: true }).populate('user', '_id name email role').populate('category', '_id name');
        return res.status(200).json({ ok: true, msg: 'The product was successfully modified.', product: update });
    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const deleteProduct = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const product = await Product.findById(id);

        if (product.state === true) {
            const deleteProduct = await Product.findByIdAndUpdate(id, { state: false });
            return res.status(200).json({ ok: true, msg: `The product ${ deleteProduct.name } was successfully deleted.` });
        } else {
            const restoreProduct = await Product.findByIdAndUpdate(id, { state: true });
            return res.status(200).json({ ok: true, msg: `The product ${ restoreProduct.name } was successfully restored.` });
        }

    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }



}



module.exports = {
    createProduct,
    deleteProduct,
    getProducts,
    getProductById,
    updateProduct
}