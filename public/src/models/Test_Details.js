const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');
const TestParameter= require('./Test_Parameter');
const Report= require('./Report');

const TestDetails = sequelize.define('Test_Details', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  cost: {
    type: DataTypes.DOUBLE,
    defaultValue:0.0,
  },
}, {
  // Other model options go here
});

TestDetails.hasMany(TestParameter, {
  onDelete:'CASCADE'
});
TestParameter.belongsTo(TestDetails);

TestDetails.hasMany(Report);
Report.belongsTo(TestDetails);
module.exports=TestDetails