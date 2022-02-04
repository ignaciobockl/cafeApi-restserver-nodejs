const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');


const validateJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'There is no token in the request.'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // read the user that corresponds to the uid
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: 'Invalid token - user does not exist in the database.'
            });
        }

        if (user.state === false) {
            return res.status(401).json({
                ok: false,
                msg: 'Invalid token - user deleted.'
            });
        }

        // send the data of the authenticated user by parameters
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token.',
            error
        });
    }

}


module.exports = {
    validateJWT
}