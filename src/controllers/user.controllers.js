const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');



const createUser = async(req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // encrypt the password
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);


    try {

        // save to database
        await user.save();

        res.status(201).json({
            ok: true,
            msg: 'The user was created successfully.',
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error trying to create a user in the database.',
            error
        });
    }

}

const deleteUser = async(req = request, res = response) => {

    const id = req.params.id;
    let stateValue = true;

    // Physical Deletion
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findById(id);

    if (user.state === true) {

        stateValue = false;
        await User.findByIdAndUpdate(id, { state: stateValue });

        return res.status(200).json({
            ok: true,
            msg: 'The user was successfully deleted.'
        });

    } else {

        stateValue = true;
        await User.findByIdAndUpdate(id, { state: stateValue });

        return res.status(200).json({
            ok: true,
            msg: 'The user was successfully restored.'
        });

    }

}

const getUsers = async(req = request, res = response) => {

    const { from = 0, limit = 10 } = req.query;

    // Validate the values entered by query 'from' and 'limit'.
    if (Number(from).toString() === 'NaN') {
        return res.status(400).json({
            ok: false,
            msg: `Invalid data type ('from'), expected number.`
        });
    }
    if (Number(limit).toString() === 'NaN') {
        return res.status(400).json({
            ok: false,
            msg: `Invalid data type ('limit'), expected number.`
        });
    }

    // const users = await User.find({ state: true })
    //     .limit(Number(limit))
    //     .skip(Number(from));

    // const totalUsers = await User.countDocuments({ state: true });

    const [totalUsers, users] = await Promise.all([
        User.countDocuments({ state: true }),
        User.find({ state: true })
        .limit(Number(limit))
        .skip(Number(from))
    ]);

    return res.status(200).json({
        ok: true,
        quantity: totalUsers,
        users
    });

}

const getUserById = async(req = request, res = response) => {

    const id = req.params.id;

    const user = await User.findById(id);

    return res.status(200).json({
        ok: true,
        user
    });

}

const updateUser = async(req = request, res = response) => {

    const id = req.params.id;
    const { _id, password, google, state, ...rest } = req.body;

    if (password) {
        // encrypt the password
        const salt = bcryptjs.genSaltSync(10);
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    return res.status(200).json({
        ok: true,
        msg: 'User modified successfully.',
        user
    })

}



module.exports = {
    createUser,
    deleteUser,
    getUsers,
    getUserById,
    updateUser
}