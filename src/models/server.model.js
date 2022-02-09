const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const { dbConnection } = require('../database/config');

const { defaultRoles } = require('../helpers/defaultData');


class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        // path of routes
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/users'
        }

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
        this.app.use(express.static('src/public'));

        // morgan: records by console all requests made to the database.
        this.app.use(morgan('dev'));

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.users, require('../routes/users.routes'));

    }


}

module.exports = Server;