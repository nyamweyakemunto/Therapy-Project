// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// // Unified authentication and authorization middleware
// exports.authMiddleware = (roles = []) => {
//     return (req, res, next) => {
//         const token = req.cookies.token;
//         console.log("🔍 => Extracted Token:", token || "❌ No Token Found");

//         if (!token) {
//             console.log('Access denied. No token provided.');
//             res.redirect('/');
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded; // Attach user info to request
//             console.log("✅ Decoded Token:", decoded); 

//             // Check if role-based authorization is required
//             if (roles.length && !roles.includes(decoded.role)) {
//                 console.log('Forbidden: Access denied.');
//                 res.redirect('/');
//             }

//             next();
//         } catch (err) {
//             console.error("❌ Token Verification Error:", err.message);
//             res.redirect('/');
//         }
//     };
// };

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Unified authentication and authorization middleware
exports.authMiddleware = (roles = []) => {
    return (req, res, next) => {
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
  
        // Role check if roles are specified
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions'
          });
        }
  
        next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
    };
  };