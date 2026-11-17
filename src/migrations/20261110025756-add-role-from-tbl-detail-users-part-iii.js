"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tbl_detail_users");
    if (!table.role) {
      await queryInterface.addColumn("tbl_detail_users", "role", {
        type: Sequelize.ENUM("SUPERADMIN", "ADMIN", "USER", "GUEST"),
        defaultValue: "GUEST",
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tbl_detail_users");
    if (table.role) {
      await queryInterface.removeColumn("tbl_detail_users", "role");
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_tbl_detail_users_role";',
      );
    }
  },
};
