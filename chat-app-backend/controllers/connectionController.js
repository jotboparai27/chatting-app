const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');

// Send a connection request
const sendRequest = async (req, res) => {
    const { recipientEmail } = req.body;

    try {
        // Find the recipient user
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Check if a request already exists
        const existingRequest = await ConnectionRequest.findOne({
            sender: req.user,
            recipient: recipient._id,
            status: 'pending',
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        // Create the connection request
        const connectionRequest = await ConnectionRequest.create({
            sender: req.user,
            recipient: recipient._id,
        });

        res.status(201).json(connectionRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error sending request', error });
    }
};

// Get all pending requests for the logged-in user
const getPendingRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            recipient: req.user,
            status: 'pending',
        }).populate('sender', 'email');

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
};

// Respond to a connection request
const respondToRequest = async (req, res) => {
    const { requestId, action } = req.body; // action: 'accept' or 'reject'

    try {
        const request = await ConnectionRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.recipient.toString() !== req.user) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        if (action === 'accept') {
            // Add connection to both users
            await User.findByIdAndUpdate(request.sender, {
                $addToSet: { connections: request.recipient },
            });
            await User.findByIdAndUpdate(request.recipient, {
                $addToSet: { connections: request.sender },
            });
            request.status = 'accepted';
        } else if (action === 'reject') {
            request.status = 'rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await request.save();
        res.status(200).json({ message: `Request ${action}ed` });
    } catch (error) {
        res.status(500).json({ message: 'Error responding to request', error });
    }
};



module.exports = { sendRequest, getPendingRequests, respondToRequest };
