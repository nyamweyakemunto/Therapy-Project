const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const dotenv = require('dotenv');
const sendEmail = require('../config/emailService.js');

dotenv.config();

/**
 * Generate JWT token and set it as a cookie
 * @param {Object} user - User object with id, name, email, role
 * @param {Object} res - Express response object
 * @returns {string} - The generated token
 */
const generateToken = (user, res) => {
    // Create token payload with user information
    const tokenPayload = {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };

    // Sign the token
    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Extend token lifetime to 24 hours
    );

    console.log("JWT created successfully");

    // Set cookie with consistent configuration
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400000, // 24 hours in milliseconds
        path: '/'
    });

    return token;
};

// **Register User**
exports.register = (req, res) => {
    try {
      const { first_name, last_name, email, phone, password, role } = req.body;
      console.log(req.body);

      if (!first_name ||!last_name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone and password are required' });
      }

      const checkUserCount = 'SELECT COUNT(*) AS count FROM users';
      db.query(checkUserCount, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const userCount = results[0].count;
        let assignedRole = userCount === 0 ? 'admin' : role;
        let isApproved = userCount === 0; // First user auto-approved

        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) return res.status(500).json({ message: 'Error hashing password' });

          const sql = 'INSERT INTO users (first_name, last_name, email, phone, password_hash, role, approved) VALUES (?, ?, ?, ?, ?, ?, ?)';
          db.query(sql, [first_name, last_name, email, phone, hashedPassword, assignedRole, isApproved], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error registering user:', err });

            const newUser = {
              user_id: result.insertId,
              first_name,
              last_name,
              email,
              phone,
              role: assignedRole,
              approved: isApproved
            };
            console.log(newUser)
            // Generate JWT and store it in cookies
            generateToken(newUser, res);
            // Send email notification
            sendEmail(email,
                'Registration Successful',
                `Hello ${first_name},\n\nYour registration was successful. Please wait for admin approval.`,
                `<p>Hello ${first_name},</p><p>Your registration was successful. Please wait for admin approval.</p>`
              );

              // Include the user's role in the response
            res.status(201).json({
              message: 'Registration successful, awaiting admin approval.',
              user: newUser
            });
          });
        });
      });
    }
    catch (err) {
      console.log(err);
    }
  };

// **Login User**
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      if (!user.approved) {
        return res.status(403).json({ message: 'Account pending admin approval' });
      }

      // Use the consistent token generation function
      const token = generateToken(user, res);

      // Return both token and user data
      res.json({
        success: true,
        message: 'Login successful',
        token, // For clients that want to store it
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        }
      });

      console.log(`User logged in: ${user.email} (${user.role})`);
    });
  });
};

// **Check Authentication Status**
exports.checkAuthStatus = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({
        message: 'User is authenticated',
        user: {
            user_id: req.user.user_id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

exports.checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Logout user by clearing the auth cookie
 * @param {Object} _req - Express request object (unused)
 * @param {Object} res - Express response object
 */
exports.logout = (_req, res) => {
    // Clear the cookie by setting an expired date
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Expire the cookie immediately
        path: '/'
    });

    console.log('Logged out successfully');

    // Return a success response instead of redirecting
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};