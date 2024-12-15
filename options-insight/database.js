const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
});

const Option = sequelize.define('Option', {
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    strike: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    bid: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    ask: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    volume: { // vol column
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    open_interest: { //OI column
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'options',
    indexes: []
});

module.exports = { sequelize, Option };
