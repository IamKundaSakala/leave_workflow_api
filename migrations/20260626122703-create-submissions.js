'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Submissions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.TEXT, allowNull: false },
      category: { 
        type: Sequelize.ENUM('Sick', 'Maternity', 'Paternity', 'Welfare', 'Other'),
        allowNull: false
      },
      description: { type: Sequelize.TEXT },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE },
      dateCreated: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      creatorId: { type: Sequelize.INTEGER, allowNull: false },
      status: { 
        type: Sequelize.ENUM('Draft', 'Submitted', 'UnderReview', 'Approved', 'Returned', 'Rejected'),
        defaultValue: 'Draft'
      },
      dateReviewed: { type: Sequelize.DATE },
      reviewerId: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Submissions');
  }
};
