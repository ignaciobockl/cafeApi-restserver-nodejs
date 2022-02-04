const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const { dbConnection } = require('../database/config');
const { defaultRoles } = require('../helpers/defaultData');


class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.userPath = '/api/users';
        this.authPath = '/api/auth';

        // Database connection
        this.connectionDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

    }

    async connectionDB() {
        await dbConnection();

        this.default();
    }

    default () {
        defaultRoles();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server run on port:', this.port)
        });
    }

    middlewares() {

        // Simple Usage (Enable All CORS Requests)
        this.app.use(cors());

        // Reading and parsing the body
        this.app.use(express.json());

        // public directory
        this.app.use(express.static('public'));


        this.app.use(morgan('dev'));

    }

    routes() {

        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.userPath, require('../routes/user.routes'));

    }


}

module.exports = Server;