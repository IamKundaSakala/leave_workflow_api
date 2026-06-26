'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role:  {
      type: DataTypes.ENUM('Applicant', 'Reviewer'),
      defaultValue: 'Applicant'
    },
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  return User;
};
