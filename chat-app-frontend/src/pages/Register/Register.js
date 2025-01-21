import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/chat');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password match validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/auth/register', {
                email,
                password,
            });

            const { token } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userEmail', email); // Save email
            navigate('/chat');
        } catch (error) {
            alert('Registration failed! Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
                Register
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 hover:underline">
                    Login
                </a>
            </p>
        </div>
    </div>
    );
};

export default Register;
