const { DataTypes } = require('sequelize');
const sequelize = require('../Database/dbConnection');

const Doctor = sequelize.define('Doctor', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});

module.exports=Doctor