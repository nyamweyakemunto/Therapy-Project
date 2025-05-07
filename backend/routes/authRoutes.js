const express = require('express');
const { register, login, checkAuthStatus, logout, checkAuth } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const db = require('../config/db.js');
const sendEmail = require('../config/emailService.js');

const router = express.Router();

router.post('/api/register', register);
router.post('/api/login', login);
router.get('/api/logout', logout);
router.get('/api/status', authMiddleware(), checkAuthStatus);
// Protected route to get user info from cookie
router.get('/user', authMiddleware(), (req, res) => {
    res.json({
        success: true,
        user: req.user // This contains the decoded token payload
      });
});

router.get('/auth/check', checkAuth);

router.post('/api/approve-user/:user_id', (req, res) => {
    const userId = req.params.user_id;
    console.log(`🔍 Approving User ID: ${userId}`);
    
    const sql = 'UPDATE users SET approved = true WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("❌ Database Error (Update):", err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already approved' });
        }
        
        const getUserSql = 'SELECT first_name, email FROM users WHERE user_id = ?';
        db.query(getUserSql, [userId], (err, userResult) => {
            if (err) {
                console.error("❌ Database Error (Fetch User):", err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (!userResult || userResult.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = userResult[0];
            sendEmail(
                user.email, 
                'Your Account Has Been Approved', 
                `Hello ${user.first_name},\n\nYour account has been approved! You can now log in and start using the system.`,
                `<p>Hello ${user.first_name},</p><p>Your account has been approved! You can now log in and start using the system.</p>`
            );

            res.json({ message: 'User approved successfully and notified via email' });
        });
    });
});


module.exports = router;