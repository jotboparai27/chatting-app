const express = require('express');
const Room = require('../models/Room'); // Room schema
const router = express.Router();

// Get or create a room using emails
router.post('/get-or-create', async (req, res) => {
    const { email1, email2 } = req.body; // Use emails instead of user IDs

    if (!email1 || !email2) {
        return res.status(400).json({ message: 'Both email addresses are required' });
    }

    try {
        // Sort emails alphabetically to ensure consistent room lookup
        const sortedEmails = [email1, email2].sort();

        // Check if a room already exists between the two users
        let room = await Room.findOne({ users: { $all: sortedEmails } });

        if (!room) {
            // If no room exists, create a new one
            const roomId = sortedEmails.join('_'); // Generate a unique room ID
            room = await Room.create({
                users: sortedEmails,
                roomId,
            });
        }

        // Return the room ID
        res.status(200).json({ roomId: room.roomId });
    } catch (error) {
        console.error('Error getting or creating room:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
