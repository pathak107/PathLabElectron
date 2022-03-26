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
  patient.hasMany(association.Invoice);
  association.Invoice.belongsTo(patient)
  return patient
} 

module.exports=Patient