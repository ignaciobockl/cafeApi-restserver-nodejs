const { response } = require('express');
const moongose = require('mongoose');



const dbConnection = async(res = response) => {

    try {

        await moongose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database is online...');

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error trying to start the database.',
            error
        });

    }

}


module.exports = {
    dbConnection
}