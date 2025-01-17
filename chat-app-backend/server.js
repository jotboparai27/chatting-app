const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const User = require('./models/User'); // Import the User model
const ConnectionRequest = require('./models/ConnectionRequest');
const connectionRoutes = require('./routes/connections');

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
        const users = await User.find({}, { email: 1, password: 1 });

        // Create HTML response
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>User List</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f9;
                        color: #333;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    table {
                        width: 80%;
                        margin: 20px auto;
                        border-collapse: collapse;
                        background-color: white;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f4f4f4;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    button {
                        padding: 5px 10px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>User List</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>${user.email}</td>
                                    <td>
                                        <span class="password">${user.password}</span>
                                    </td>
                                    <td>
                                        <button onclick="togglePassword(this)">Show</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <script>
                    function togglePassword(button) {
                        const passwordSpan = button.closest('tr').querySelector('.password');
                        if (button.textContent === 'Show') {
                            button.textContent = 'Hide';
                            passwordSpan.textContent = passwordSpan.dataset.original;
                        } else {
                            button.textContent = 'Show';
                            passwordSpan.textContent = '*'.repeat(5);
                        }
                    }

                    // Mask passwords initially
                    document.querySelectorAll('.password').forEach(span => {
                        span.dataset.original = span.textContent;
                        span.textContent = '*'.repeat(5);
                    });
                </script>
            </body>
            </html>
        `;

        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <body>
                <h1>Error Fetching Users</h1>
                <p>${error.message}</p>
            </body>
            </html>
        `);
    }
});

//connection route

app.use('/api/connections', connectionRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
