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
  bill_cache: {
    type: DataTypes.STRING, // To store the json value of bill to avoid joining of multiple tables
  },
  bill_file_path: {
    type: DataTypes.STRING,
  },

}, {
  // Other model options go here
});
Invoice.hasMany(Report,{
  onDelete:'CASCADE'
});
Report.belongsTo(Invoice);

module.exports=Invoice