//const mysql = require('mysql2');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('tauschboerse','root','MySQL#12',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;