const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const User = require('./models/User'); // Import the User model

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON requests
app.use(
    cors({
        origin: 'http://localhost:3000', // Replace with your frontend URL
    })
);
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { email: 1, password: 1 });// Fetch email and password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
