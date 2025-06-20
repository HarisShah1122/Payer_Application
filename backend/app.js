require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const sequelize = require('./config/database');
const User = require('./models/Users');
const validation = require('./helpers/validation.request');

// ====== MIDDLEWARE SETUP ======

// 1. CORS middleware - MUST come before routes!
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // allow cookies, authorization headers
}));

// 2. Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Session middleware (needs to be before routes that use req.session)
app.use(session({
  secret: process.env.SESSION_SECRET || '8Kj9mPq2v',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: false,               // set true if using HTTPS
    sameSite: 'lax',
  },
}));

// 4. Optional validation middleware if exists
if (typeof validation.validateRequestBody === 'function') {
  app.use(validation.validateRequestBody);
} else {
  console.warn('Skipping validateRequestBody middleware; not a function');
}

// ====== JWT AUTH FUNCTION ======
const JWT_SECRET = process.env.JWT_SECRET || '8Kj9mPq2v';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ====== ROUTES ======

// Public signup route
app.post('/signup', async (req, res) => {
  try {
    const { firstname, lastname, email, password, healthAuthority } = req.body;
    if (!firstname || !lastname || !email || !password || !healthAuthority) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = await User.create({
      firstname,
      lastname,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      healthAuthority,
    });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Public login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route example
app.get('/home', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Home Page!' });
});

// ====== CONTROLLER ROUTES ======
// Load all controllers after middleware
fs.readdirSync('./controllers').forEach(file => {
  if (file.endsWith('.js')) {
    try {
      const route = require('./controllers/' + file);
      if (typeof route.controller === 'function') {
        route.controller(app);
      } else {
        console.error(`Error: ${file} does not export a valid controller function`);
      }
    } catch (err) {
      console.error(`Failed to load ${file}:`, err.message);
      console.error(err.stack);
    }
  }
});

// ====== START SERVER ======
const port = 8081;
sequelize.sync({ force: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
