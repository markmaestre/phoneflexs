const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);