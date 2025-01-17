import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Connections = () => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch pending requests
    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('authToken'); // Replace with your token storage method
            const response = await axios.get(
                'http://localhost:5001/api/connections/pending',
                { headers: { Authorization: `${token}` } }
            );
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    // Handle sending connection requests
    const handleSendRequest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                'http://localhost:5001/api/connections/request',
                { recipientEmail },
                { headers: { Authorization: `${token}` } }
            );

            setSuccessMessage(`Request sent to ${recipientEmail}`);
            setErrorMessage('');
            setRecipientEmail(''); // Clear input
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Error sending request'
            );
            setSuccessMessage('');
        }
    };

    // Handle accept/reject request
    const handleRespond = async (requestId, action) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://localhost:5001/api/connections/respond',
                { requestId, action },
                { headers: { Authorization: `${token}` } }
            );

            setSuccessMessage(`Request ${action}ed successfully!`);
            setErrorMessage('');
            fetchPendingRequests(); // Refresh the list of pending requests
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Error responding to request'
            );
            setSuccessMessage('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Connections</h1>

            {/* Send Request Form */}
            <form onSubmit={handleSendRequest} className="w-full max-w-md mb-8">
                <input
                    type="email"
                    placeholder="Recipient's Email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Send Request
                </button>
            </form>

            {successMessage && (
                <p className="mt-4 text-green-500">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mt-4 text-red-500">{errorMessage}</p>
            )}

            {/* Pending Requests */}
            <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
            <ul className="w-full max-w-md">
                {pendingRequests.length === 0 ? (
                    <p>No pending requests</p>
                ) : (
                    pendingRequests.map((request) => (
                        <li
                            key={request._id}
                            className="p-4 border border-gray-300 rounded mb-2 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">
                                    {request.sender.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Status: {request.status}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        handleRespond(request._id, 'accept')
                                    }
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() =>
                                        handleRespond(request._id, 'reject')
                                    }
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Connections;
