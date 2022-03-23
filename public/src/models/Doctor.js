const { DataTypes } = require('sequelize');

const Doctor = (sequelize)=> sequelize.define('Doctor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  field: {
    type: DataTypes.STRING,
  },
  degree: {
    type: DataTypes.TEXT,
  },
  address: {
    type: DataTypes.TEXT,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
}, {
  // Other model options go here
});

module.exports=Doctor