const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user', // Replace with your MySQL username
    password: 'your_mysql_password', // Replace with your MySQL password
    database: 'facial_timesheet' // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

router.post('/signup', async (req, res) => {
    const { username, email, password, firstName, lastName, phone } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO users (username, email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, firstName, lastName, phone], (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).json({ error: 'Failed to create user' });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router; 