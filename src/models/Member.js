const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
