const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const Invoice= require('./Invoice')

const Report = sequelize.define('Report', {
    referred_by: {
        type: DataTypes.STRING,
    },
    completed: {
        type: DataTypes.BOOLEAN, // status of the report 
        defaultValue: false,
    },
    report_file_path: {
        type: DataTypes.STRING,
    },
}, {
    // Other model options go here
});

Report.belongsTo(Invoice);

module.exports = Report