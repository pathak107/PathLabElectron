const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const Patient = require('./Patient');
const Report = require('./Report');

const Invoice = sequelize.define('Invoice', {
  total_amount: {
    type: DataTypes.DOUBLE,
    defaultValue:0
  },
  discount: {
    type: DataTypes.DOUBLE,
    defaultValue:0
  },
  final_amount: {
    type: DataTypes.DOUBLE,
    defaultValue:0
  },

}, {
  // Other model options go here
});

Invoice.belongsTo(Patient)
Invoice.hasMany(Report);

module.exports=Invoice