const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { validationUser } = require('../helpers/validation');
const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require('jsonwebtoken'); 

module.exports.controller = function (app) {
  app.post(
    '/login', 
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array().map((err) => err.msg).join(', '),
        });
      }

      try {
        const user = await Users.findOne({ where: { email: req.body.email } });
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials.' });
        }

        req.session.username = req.body.email;
        return res.status(200).json({ message: 'User successfully logged in.' });
      } catch (error) {
        console.log('Login error:', error); 
        return res.status(500).json({ error: 'Login failed: ' + error.message });
      }
    }
  );

  app.post(
    '/signup',
    validationUser,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: errors.array().map((err) => err.msg).join(', '),
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await Users.create({
          healthAuthority: req.body.healthAuthority,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hashedPassword,
        });

        const token = jwt.sign({ email: user.email }, 'your-secret-key', { expiresIn: '24h' });
        return res.status(201).json({ message: 'User registered successfully.', token });
      } catch (error) {
        console.log('User registration error:', error);
        return res.status(500).json({ error: 'User registration failed: ' + error.message });
      }
    }
  );

  app.get('/check-auth', (req, res) => {
    if (req.session.username) {
      return res.status(200).json({ message: 'Authenticated' });
    }
    return res.status(401).json({ error: 'Not authenticated' });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Logout error:', err); 
        return res.status(500).json({ error: 'Logout failed: ' + err.message });
      }
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
};