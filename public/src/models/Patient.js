const { DataTypes } = require('sequelize');

const Patient = (sequelize, association)=>{
  const patient = sequelize.define('Patient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
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
      allowNull: false
    },
    blood_group: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER, //in kgs
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
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
  patient.hasMany(association.Invoice);
  association.Invoice.belongsTo(patient)
  return patient
} 

module.exports=Patient