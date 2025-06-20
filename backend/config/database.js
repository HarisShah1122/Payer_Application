const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;