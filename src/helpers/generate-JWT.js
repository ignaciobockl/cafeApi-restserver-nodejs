const jwt = require('jsonwebtoken');


const generateJWT = async(uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '30m'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('The TOKEN could not be generated.');
            } else {
                resolve(token);
            }
        });
    });
}


module.exports = {
    generateJWT
}