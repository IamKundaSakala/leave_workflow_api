'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      { name: 'Kunda', email: 'kunda@gmail.com', password: "test@123", role: "Applicant", createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sakala', email: 'sakala@gmail.com', password: "test@123", role: "Reviewer", createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

