const { DataTypes } = require('sequelize');
const TestParameter = (sequelize)=> sequelize.define('Test_Parameter', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
    },
    range: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT
    },
}, {
    // Other model options go here
});


module.exports = TestParameter