const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: { type: String, require: [true, 'Name is required.'], unique: true },
    state: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true }
});

CategorySchema.methods.toJSON = function() {
    const { __v, state, ...category } = this.toObject();
    // category.uid = _id;
    return category;
}

module.exports = model('Category', CategorySchema);