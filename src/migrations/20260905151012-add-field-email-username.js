'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('tbl_detail_users', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    });
    await queryInterface.addColumn('tbl_detail_users', 'username', {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('tbl_detail_users', 'email');
    await queryInterface.removeColumn('tbl_detail_users', 'username');
  }
};
