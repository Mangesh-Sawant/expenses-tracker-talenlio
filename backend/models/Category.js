const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Category', categorySchema);
