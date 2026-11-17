'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (table.address) {
      await queryInterface.removeColumn('tbl_detail_users', 'address');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (!table.address) {
      await queryInterface.addColumn('tbl_detail_users', 'address', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  }
};
