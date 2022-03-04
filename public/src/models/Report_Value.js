const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const Report = require('./Report');
const TestParameter= require('./Test_Parameter');

const ReportValue = sequelize.define('ReportValue', {
    reportId: {
        type: DataTypes.INTEGER,
        references: {
            model: Report, 
            key: 'id'
        }
    },
    parameterId: {
        type: DataTypes.INTEGER,
        references: {
            model: TestParameter, 
            key: 'id'
        }
    },
    value:{
        type:DataTypes.STRING
    }
}, {
    // Other model options go here
});

Report.belongsToMany(TestParameter, { through: ReportValue });
TestParameter.belongsToMany(Report, { through: ReportValue });

module.exports = ReportValue