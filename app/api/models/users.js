const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    postcode: {
        type: String,
        trim: true,
        required: true
    },
    marketing: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('User', UserSchema);