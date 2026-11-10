"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn("tbl_detail_users", "role");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_detail_users", "role", {
      type: Sequelize.ENUM("SUPERADMIN", "ADMIN", "USER", "GUEST"),
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "tbl_detail_users" 
      ALTER COLUMN "role" SET DEFAULT 'GUEST'::"enum_tbl_detail_users_role"
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
