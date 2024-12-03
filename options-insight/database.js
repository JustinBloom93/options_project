const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'optionsDatabase.sqlite'
});

const Option = sequelize.define('Option', {
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    strike: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bid: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ask: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database & tables created.');
    });

module.exports = Option;
