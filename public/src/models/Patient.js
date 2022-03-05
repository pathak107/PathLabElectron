const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const Invoice = require('./Invoice');
const Report = require('./Report');

const Patient = sequelize.define('Patient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  age: {
    type: DataTypes.INTEGER,
  },
  weight: {
    type: DataTypes.INTEGER, //in kgs
  },
  email: {
    type: DataTypes.STRING,
    validate:{
        isEmail:true
    }
  },
}, {
  // Other model options go here
});

Patient.hasMany(Invoice);
Invoice.belongsTo(Patient)

module.exports=Patient