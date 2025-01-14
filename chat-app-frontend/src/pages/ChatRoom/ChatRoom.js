import React, { useState } from 'react';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]); // State to store messages
    const [inputMessage, setInputMessage] = useState(''); // State for the input field

    // Function to handle sending messages
    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                sender: 'You', // Hardcoded sender for now
            };
            setMessages([...messages, newMessage]); // Add new message to the messages array
            setInputMessage(''); // Clear the input field
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
                {/* Chat Header */}
                <div className="bg-blue-600 text-white text-lg font-bold p-4 rounded-t-lg">
                    ChatRoom
                </div>

                {/* Chat Messages */}
                <div className="p-4 h-96 overflow-y-auto">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-2 my-2 ${
                                message.sender === 'You'
                                    ? 'bg-blue-100 text-blue-900 self-end'
                                    : 'bg-gray-200 text-gray-900'
                            } rounded-md`}
                        >
                            <strong>{message.sender}: </strong>
                            {message.text}
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="flex items-center p-4 border-t">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
