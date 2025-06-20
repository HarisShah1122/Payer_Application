const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Users = require('./Users');

// Define models object
const models = {
  Users
};

// Sync models with database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Models synced with database');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Export models
module.exports = models;
