const { DataTypes } = require('sequelize');

const Report = (sequelize) => sequelize.define('Report', {
    referred_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN, // status of the report 
        defaultValue: false,
    },
    notify_patients: {
        type: DataTypes.BOOLEAN, // SMS, Whatsapp, email
        defaultValue: false,
    },
    report_file_path: {
        type: DataTypes.STRING,
    },
    remarks: {
        type: DataTypes.TEXT,
    },
    barcode: {
        type: DataTypes.STRING,
    },
    qrCode:{
        type: DataTypes.STRING
    }
}, {
    // Other model options go here
});


module.exports = Report