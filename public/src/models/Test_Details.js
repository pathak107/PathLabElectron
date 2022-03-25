const { DataTypes } = require('sequelize');

const TestDetails = (sequelize, association) => {
  const testDetails = sequelize.define('Test_Details', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mode: {
      type: DataTypes.STRING, // like blood sample or throat swab
    },
    description: {
      type: DataTypes.TEXT,
    },
    cost: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0,
    },
  }, {
    // Other model options go here
  });

  testDetails.hasMany(association.TestParameter, {
    onDelete: 'CASCADE'
  });
  association.TestParameter.belongsTo(testDetails);

  testDetails.hasMany(association.Report, {
    onDelete: 'CASCADE'
  });
  association.Report.belongsTo(testDetails);
  return testDetails

}
module.exports = TestDetails