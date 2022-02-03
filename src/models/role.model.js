const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'The role is required.'],
        default: 'USER_ROLE'
    }
});

module.exports = model('Role', RoleSchema);