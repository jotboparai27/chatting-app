import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://chat-app-backend-mxdt.onrender.com'); // Connect to the backend Socket.IO server

const ChatRoom = () => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomMembers, setRoomMembers] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(''); // Store current room ID
    const navigate = useNavigate();
    const myEmail = localStorage.getItem('userEmail'); // Logged-in user's email

    // Fetch connected users
    useEffect(() => {
        const fetchConnectedUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(
                    'https://chat-app-backend-mxdt.onrender.com/api/connections/connected-users',
                    { headers: { Authorization: `${token}` } }
                );
                setConnectedUsers(response.data);
            } catch (error) {
                console.error('Error fetching connected users:', error);
            }
        };

        fetchConnectedUsers();
    }, []);

    // Handle selecting a user
    const handleSelectUser = async (user) => {
        setSelectedUser(user);

        try {
            // Request the room ID from the backend
            const response = await axios.post('https://chat-app-backend-mxdt.onrender.com/api/rooms/get-or-create', {
                email1: myEmail,
                email2: user.email,
            });

            const roomId = response.data.roomId; // Room ID from backend
            console.log(`Room ID from backend: ${roomId}`);
            setCurrentRoomId(roomId); // Store the current room ID

            // Join the room
            socket.emit('joinRoom', roomId);

            // Check room members
            socket.emit('checkRoom', roomId);

            setMessages([]); // Clear messages when switching chats
        } catch (error) {
            console.error('Error getting or creating room:', error);
        }
    };

    // Listen for incoming messages and room updates
    useEffect(() => {
        socket.on('message', (data) => {
            // Avoid adding the same message twice for the sender
            if (data.room === currentRoomId && data.sender !== myEmail) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });
        socket.on('roomMembers', (members) => {
            setRoomMembers(members);
            console.log(`Room members updated:`, members);
        });

        return () => {
            socket.off('message');
            socket.off('roomMembers');
        };
    }, [currentRoomId]);

    // Handle sending a message
    const handleSendMessage = () => {
        if (message.trim() && selectedUser) {
            const messageData = {
                room: currentRoomId, // Use the stored room ID
                text: message, // Message text
                sender: myEmail, // Sender email
            };

            socket.emit('message', messageData); // Emit the message to the server
            setMessages((prevMessages) => [...prevMessages, messageData]); // Add message locally
            setMessage(''); // Clear input
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* User List */}
            <div className="w-1/3 bg-gray-100 p-4">
                <h2 className="text-lg font-bold mb-4">Connected Users</h2>
                <button
                    onClick={() => navigate('/connections')}
                    className="w-full bg-green-500 text-white py-2 rounded mb-4 hover:bg-green-600"
                >
                    Manage Connections
                </button>
                <ul>
                    {connectedUsers.map((user) => (
                        <li
                            key={user._id}
                            className={`p-2 cursor-pointer rounded ${selectedUser?._id === user._id
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-200'
                                }`}
                            onClick={() => handleSelectUser(user)}
                        >
                            {user.email}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 p-4 flex flex-col">
                {selectedUser ? (
                    <>
                        <h2 className="text-lg font-bold mb-4">
                            Chatting with {selectedUser.email}
                        </h2>
                        <div className="flex-grow border p-4 mb-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 ${msg.sender === myEmail
                                            ? 'text-right'
                                            : 'text-left'
                                        }`}
                                >
                                    <span
                                        className={`p-2 rounded inline-block ${msg.sender === myEmail
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200'
                                            }`}
                                    >
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-bold mb-2">Room Members</h3>
                            <ul>
                                {roomMembers.map((member, index) => (
                                    <li key={index} className="text-sm text-gray-700">
                                        {member}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-grow border p-2 rounded"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Select a user to start chatting.</p>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
