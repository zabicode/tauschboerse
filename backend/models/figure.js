const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Figure = sequelize.define('figures', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    description:{
        type: Sequelize.STRING,
        allowNull: false
    },
    franchise: Sequelize.STRING,
    imagePath: Sequelize.STRING

});

module.exports = Figure;