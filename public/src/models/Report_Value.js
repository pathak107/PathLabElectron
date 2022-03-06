const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const Report = require('./Report');
const TestParameter= require('./Test_Parameter');

const ReportValue = sequelize.define('ReportValue', {
    value:{
        type:DataTypes.STRING,
        defaultValue: ""
    }
}, {
    // Other model options go here
});
ReportValue.sync()

Report.belongsToMany(TestParameter, { through: ReportValue });
TestParameter.belongsToMany(Report, { through: ReportValue });

module.exports = ReportValue