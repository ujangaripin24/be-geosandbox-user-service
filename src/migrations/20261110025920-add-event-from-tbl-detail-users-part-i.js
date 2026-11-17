"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tbl_detail_users");
    if (!table.event_type) {
      await queryInterface.addColumn("tbl_detail_users", "event_type", {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tbl_detail_users");
    if (table.event_type) {
      await queryInterface.removeColumn("tbl_detail_users", "event_type");
    }
  },
};
