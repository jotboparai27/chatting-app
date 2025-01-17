import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatRoom = () => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Fetch connected users
    useEffect(() => {
        const fetchConnectedUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(
                    'http://localhost:5001/api/connections/connected-users',
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
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear messages when switching chats
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { sender: 'You', text: message }]);
            setMessage(''); // Clear the input
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* User List */}
            <div className="w-1/3 bg-gray-100 p-4">
                <h2 className="text-lg font-bold mb-4">Connected Users</h2>
                <ul>
                    {connectedUsers.map((user) => (
                        <li
                            key={user._id}
                            className={`p-2 cursor-pointer rounded ${
                                selectedUser?._id === user._id
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
                                    className={`mb-2 ${
                                        msg.sender === 'You'
                                            ? 'text-right'
                                            : 'text-left'
                                    }`}
                                >
                                    <span
                                        className={`p-2 rounded inline-block ${
                                            msg.sender === 'You'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200'
                                        }`}
                                    >
                                        {msg.text}
                                    </span>
                                </div>
                            ))}
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
