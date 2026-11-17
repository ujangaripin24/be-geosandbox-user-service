'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (!table.email) {
      await queryInterface.addColumn('tbl_detail_users', 'email', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      });
    }
    if (!table.username) {
      await queryInterface.addColumn('tbl_detail_users', 'username', {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (table.email) {
      await queryInterface.removeColumn('tbl_detail_users', 'email');
    }
    if (table.username) {
      await queryInterface.removeColumn('tbl_detail_users', 'username');
    }
  }
};
