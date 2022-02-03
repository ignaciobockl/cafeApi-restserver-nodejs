const { response } = require("express");

const Role = require("../models/role.model");


const defaultRoles = async(res = response) => {

    const role = await Role.findOne({ role: 'USER_ROLE' });

    if (!role) {

        const data = [{
                "role": "ADMIN_ROLE"
            },
            {
                "role": "USER_ROLE"
            }
        ];

        const createRoles = await Role.create(data);
        console.log(`Roles created successfully: ${ createRoles }`);

    }


}

module.exports = {
    defaultRoles
}