"use strict";

const { types } = require("pg");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("tbl_detail_users", "role", {
      type: Sequelize.ENUM("SUPERADMIN", "ADMIN", "USER", "GUEST"),
      defaultValue: "GUEST",
      allowNull: false,
    });

    await queryInterface.addColumn("tbl_detail_users", "uuid_company", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_detail_users", "event_type", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.addConstraint("tbl_detail_users", {
      type: "foreign key",
      fields: ["uuid_company"],
      name: "fk_tbl_detail_users_uuid_company",
      references: {
        table: "tbl_companies",
        field: "uuid",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      "tbl_detail_users",
      "fk_tbl_detail_users_uuid_company",
    );
    await queryInterface.removeColumn("tbl_detail_users", "uuid_company");
    await queryInterface.removeColumn("tbl_detail_users", "event");
    await queryInterface.removeColumn("tbl_detail_users", "role");
  },
};
