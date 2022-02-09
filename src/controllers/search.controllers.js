const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { User, Category, Product } = require("../models");

const allowedCollections = [
    'categories',
    'products',
    'users'
];

const searchUsers = async(term = '', res = response) => {

    // search term by id
    const isMongoId = isValidObjectId(term);
    if (isMongoId) {
        const user = await User.findById(term);
        if (!user) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
        return res.status(200).json({ ok: true, results: (user) ? [user] : [] });
    }

    // regular phrase - 'i':insensitive
    const regex = new RegExp(term, 'i');

    // search term by name or email
    const user = await User.find({ $or: [{ name: regex }, { email: regex }], $and: [{ state: true }] });
    if (user[0] === undefined) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
    const quantity = user.length;
    return res.status(200).json({ ok: true, quantity: quantity, results: user });

}

const searchCategories = async(term = '', res = response) => {

    // search term by id
    const isMongoId = isValidObjectId(term);
    if (isMongoId) {
        const categories = await Category.findById(term).populate('user', 'name email');
        if (!categories) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
        return res.status(200).json({ ok: true, results: categories });
    }

    // regular phrase - 'i':insensitive
    const regex = new RegExp(term, 'i');

    // search term by name
    const categories = await Category.find({ $or: [{ name: regex }], $and: [{ state: true }] }).populate('user', 'name email');
    if (categories[0] === undefined) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
    const quantity = categories.length;
    return res.status(200).json({ ok: true, quantity: quantity, results: categories });

}

const searchProducts = async(term = '', res = response) => {

    // search term by id
    const isMongoId = isValidObjectId(term);
    if (isMongoId) {
        const products = await Product.findById(term).populate('user', 'name email').populate('category', 'name');
        if (!products) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
        return res.status(200).json({ ok: true, results: products });
    }

    // regular phrase - 'i':insensitive
    const regex = new RegExp(term, 'i');

    // search term by name
    const products = await Product.find({ $or: [{ name: regex }], $and: [{ state: true }] }).populate('user', 'name email').populate('category', 'name');
    if (products[0] === undefined) { return res.status(400).json({ ok: false, errorMsg: `No user found with search term: ${ term }.` }) }
    const quantity = products.length;
    return res.status(200).json({ ok: true, quantity: quantity, results: products });

}


const search = async(req = request, res = response) => {

    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) { return res.status(400).json({ ok: false, errorMsg: `The allowed collections are: ${ allowedCollections }.` }) }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;

        case 'users':
            searchUsers(term, res);
            break;

        default:
            return res.status(500).json({ ok: false, errorMsg: 'There are no searches to do.' });
    }

}


module.exports = {
    search
}