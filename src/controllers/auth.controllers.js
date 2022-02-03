const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-JWT');

const User = require('../models/user.model');


const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // check if the email exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: `The email ${ email } is not registered in the database.`
            });
        }

        // check if the user is active
        if (user.state === false) {
            return res.status(400).json({
                ok: false,
                msg: 'The user is deleted.'
            });
        }

        // check if the password is correct
        const validPass = bcryptjs.compareSync(password, user.password);
        if (!validPass) {
            return res.status(400).json({
                ok: false,
                msg: 'The entered password is incorrect.'
            });
        }

        // generate the JWT
        const token = await generateJWT(user.id);


        return res.status(200).json({
            ok: true,
            msg: 'Login ok!',
            token: token,
            user
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error when trying to login user.',
            error
        });
    }

}


module.exports = {
    login
}