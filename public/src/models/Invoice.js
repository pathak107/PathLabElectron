const { DataTypes } = require('sequelize');

const Invoice = (sequelize, association)=> {
  const invoice= sequelize.define('Invoice', {
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
    total_tax: {
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

  invoice.hasMany(association.Report,{
    onDelete:'CASCADE'
  });
  association.Report.belongsTo(invoice);
  return invoice;

} 

module.exports=Invoice