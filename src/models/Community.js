const mongoose = require('mongoose');
const { Schema } = mongoose;

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 128
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
