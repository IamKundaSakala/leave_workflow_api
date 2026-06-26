'use strict';
module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Sick', 'Maternity', 'Paternity', 'Welfare', 'Other'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Submitted', 'UnderReview', 'Approved', 'Returned', 'Rejected'),
      defaultValue: 'Draft'
    },
    dateReviewed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});

  Submission.associate = function(models) {
    Submission.belongsTo(models.User, { as: 'Creator', foreignKey: 'creatorId' });
    Submission.belongsTo(models.User, { as: 'Reviewer', foreignKey: 'reviewerId' });
  };

  return Submission;
};
