const express = require('express');
const { sendRequest, getPendingRequests, respondToRequest } = require('../controllers/connectionController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

// Send a connection request
router.post('/request', protect, sendRequest);

// Get all pending requests for the logged-in user
router.get('/pending', protect, getPendingRequests);

// Respond to a connection request (accept/reject)
router.post('/respond', protect, respondToRequest);

module.exports = router;
