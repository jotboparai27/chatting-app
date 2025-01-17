const express = require('express');
const { sendRequest, getPendingRequests, respondToRequest } = require('../controllers/connectionController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const User = require('../models/User');

// Send a connection request
router.post('/request', protect, sendRequest);

// Get all pending requests for the logged-in user
router.get('/pending', protect, getPendingRequests);

// Respond to a connection request (accept/reject)
router.post('/respond', protect, respondToRequest);

// Get all connected users for the logged-in user
router.get('/connected-users', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate(
            'connections',
            'email'
        );

        res.status(200).json(user.connections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching connected users', error });
    }
});

module.exports = router;
