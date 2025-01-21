const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { createServer } = require('http'); // HTTP server
const { Server } = require('socket.io'); // Socket.IO
const authRoutes = require('./routes/auth');
const connectionRoutes = require('./routes/connections');
const roomRoutes = require('./routes/rooms'); // Import room routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your frontend URL
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/rooms', roomRoutes); // Add room routes

// Create an HTTP server and integrate Socket.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your frontend URL
        methods: ['GET', 'POST'],
    },
});

// Socket.IO Event Handlers
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room
    socket.on('joinRoom', (room) => {
        if (!room) {
            console.error('Invalid room ID');
            return;
        }
        socket.join(room);
        console.log(`User joined room: ${room}`);
        
        // Log members of the room
        const roomMembers = io.sockets.adapter.rooms.get(room);
        console.log(`Members in room ${room}:`, roomMembers ? [...roomMembers] : 'No members');
    });

    // Handle incoming messages
    socket.on('message', (data) => {
        if (!data.room || !data.text) {
            console.error('Invalid message data');
            return;
        }
        console.log(`Message from ${socket.id}: ${data.text} in room ${data.room}`);
        socket.to(data.room).emit('message', data); // Broadcast message to room
    });

    // Handle checkRoom event
    socket.on('checkRoom', (room) => {
        console.log(`checkRoom event received for room: ${room}`);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        if (roomMembers) {
            console.log(`Members in room ${room}:`, [...roomMembers]);
            socket.emit('roomMembers', [...roomMembers]); // Send the room members back to the client
        } else {
            console.log(`Room ${room} does not exist or has no members.`);
            socket.emit('roomMembers', []); // Send an empty array if no members
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
