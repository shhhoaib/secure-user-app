const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'security.log' })
  ]
});
const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

const app = express();
app.use(express.json());

// FIX 1: Helmet - HTTP Security Headers
app.use(helmet());

// Signup Route - Saari fixes yahan hain
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
logger.info(`Signup attempt for: ${email}`);

  // FIX 2: Input Validation
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({ error: 'Password must be 8+ characters' });
  }

  // FIX 3: Password Hashing with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // FIX 4: JWT Token
  const token = jwt.sign({ email }, 'my-secret-key-2024', { expiresIn: '1h' });

  res.json({
    message: 'User registered successfully!',
    hashedPassword,
    token
  });
});

app.listen(4000, () => {
  console.log('Secure app running on http://localhost:4000');
});