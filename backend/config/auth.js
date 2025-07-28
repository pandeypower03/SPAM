const jwt= require('jsonwebtoken');
const dotenv=require('dotenv').config();
const JWT_SECRET    = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [ , token ] = auth.split(' ');

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    //breakdown the token and verify it
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      ...payload,
      user_id: payload.user_id.id || payload.user_id, // Handle both formats
    };
      console.log("req.user set to:", req.user);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

const generateToken = (user_id) => {
  return jwt.sign(
    { user_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  )};

module.exports = { requireAuth, generateToken };