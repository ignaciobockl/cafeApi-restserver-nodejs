const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generateJWT } = require('../helpers/generate-JWT');
const { googleVerify } = require('../helpers/google-verify');

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


const googleSignIn = async(req = request, res = response) => {

    const { id_token } = req.body;

    try {

        // const googleUser = await googleVerify(id_token);
        const { name, picture, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {

            // encrypt the password
            const salt = bcryptjs.genSaltSync(10);
            const pass = bcryptjs.hashSync('123456', salt);

            // create user
            const data = {
                name,
                email,
                password: pass,
                img: picture,
                google: true
            }

            user = new User(data);
            await user.save();
        }

        // deny access if google user is in 'false' state
        if (!user.state) {
            return res.status(401).json({
                ok: false,
                msg: 'Talk to administrator, user blocked!'
            });
        }

        // generate the JWT
        const token = await generateJWT(user.id);

        return res.status(200).json({
            ok: true,
            msg: 'Google Sign In OK!',
            user,
            token
        });


    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'The Google Token could not be verified.',
            error
        });
    }


}


module.exports = {
    googleSignIn,
    login
}