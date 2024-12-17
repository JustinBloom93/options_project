const { Sequelize, DataTypes } = require('sequelize'); // this code is not needed, unless you need to verify data
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
});

const Option = sequelize.define('Option', {
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
}, {
    tableName: 'options',
});

async function verifyData() {
    try {

        await sequelize.sync();

        const options = await Option.findAll();

        console.log('Stored Options:', options.map(option => option.toJSON()));
    } catch (error) {
        console.error('Error verifying data:', error);
    } finally {
        await sequelize.close();
    }
}

verifyData();
