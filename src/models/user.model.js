const { Schema, model } = require('mongoose');


const UserSchema = Schema({
    name: {
        type: String,
        require: [true, 'Name is required.']
    },
    email: {
        type: String,
        require: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'The password is required.']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        require: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


UserSchema.methods.toJSON = function() {
    const { __v, password, state, ...user } = this.toObject();
    return user;
}


module.exports = model('User', UserSchema);