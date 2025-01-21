const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    users: [
        {
            type: String, // Store emails as strings
            required: true,
        },
    ],
    roomId: {
        type: String,
        required: true,
        unique: true, // Ensure room IDs are unique
    },
});

module.exports = mongoose.model('Room', roomSchema);
