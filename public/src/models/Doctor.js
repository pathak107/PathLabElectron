const { DataTypes } = require('sequelize');

const Doctor = (sequelize, association) => {
  const doctor = sequelize.define('Doctor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false
    },
    degree: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    signature_file_path: {
      type: DataTypes.STRING,
    }
  }, {
    // Other model options go here
  });
  doctor.hasMany(association.Report)
  association.Report.belongsTo(doctor)
  return doctor
}

module.exports = Doctor