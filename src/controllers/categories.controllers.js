const { request, response } = require("express");
const { Category } = require('../models');


const createCategory = async(req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    // check if the category exists in the database
    const categoryDB = await Category.findOne({ name });
    if (categoryDB) {
        return res.status(400).json({ ok: false, msg: `The category ${ name } already exists in the database.` });
    }

    // generate the data to save
    const data = { name, state: true, user: req.user._id };
    const category = new Category(data);

    // save to database
    await category.save();
    return res.status(201).json({ ok: true, msg: 'The category was created successfully.', category });

}

const getCategories = async(req = request, res = response) => {

    const { from = 0, limit = 10 } = req.query;

    // Validate the values entered by query 'from' and 'limit'.
    if (Number(from).toString() === 'NaN') { return res.status(400).json({ ok: false, msg: `Invalid data type ('from'), expected number.` }) }
    if (Number(limit).toString() === 'NaN') { return res.status(400).json({ ok: false, msg: `Invalid data type ('limit'), expected number.` }) }

    const [totalCategories, categories] = await Promise.all([
        Category.countDocuments({ state: true }),
        Category.find({ state: true })
        .limit(Number(limit))
        .skip(Number(from))
        .populate('user', '_id name email role')
    ]);

    // check if there are categories in the database
    if (totalCategories === 0) { return res.status(400).json({ ok: false, msg: 'There are no categories in the database.' }) }

    return res.status(200).json({ ok: true, quantity: totalCategories, categories });

}

const getCategoryById = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const category = await Category.findById(id).populate('user', '_id name email role');
        return res.status(200).json({ ok: true, category });

    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const deleteCategory = async(req = request, res = response) => {

    const id = req.params.id;

    try {

        const category = await Category.findById(id).populate('user', '_id name email role');

        if (category.state === true) {

            const deleteCategory = await Category.findByIdAndUpdate(id, { state: false });
            return res.status(200).json({ ok: true, msg: `The category ${ deleteCategory.name } was deleted successfully.` });

        } else {

            const restoreCategory = await Category.findByIdAndUpdate(id, { state: true });
            return res.status(200).json({ ok: true, msg: `The category ${ restoreCategory.name } was successfully restored.` });

        }

    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }

}

const updateCategory = async(req = request, res = response) => {

    const id = req.params.id;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    try {

        const category = await Category.findByIdAndUpdate(id, data, { new: true }).populate('user', '_id name email role');
        return res.status(200).json({ ok: true, msg: `The category ${ category.name } was successfully updated.`, category });

    } catch (error) {
        return res.status(400).json({ ok: false, error });
    }


}



module.exports = {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory
}