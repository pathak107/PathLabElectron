const { DataTypes } = require('sequelize');

const ReportValue = (sequelize, association) => {
    const reportValue= sequelize.define('ReportValue', {
        value: {
            type: DataTypes.STRING,
            defaultValue: ""
        }
    }, {
        // Other model options go here
    });
    association.Report.belongsToMany(association.TestParameter, { through: reportValue });
    association.TestParameter.belongsToMany(association.Report, { through: reportValue });
    return reportValue

}

module.exports = ReportValue