"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_user_login_history", {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      uuid_user: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "tbl_detail_users",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Unknown",
      },
      device: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Desktop",
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Unknown Browser",
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Unknown OS",
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      lng: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("SUCCESS", "FAILED"),
        defaultValue: "SUCCESS",
        allowNull: false,
      },
      failure_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      login_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("tbl_user_login_history", ["uuid_user"]);
    await queryInterface.addIndex("tbl_user_login_history", ["ip_address"]);
    await queryInterface.addIndex("tbl_user_login_history", ["login_at"]);
    await queryInterface.addIndex("tbl_user_login_history", ["uuid_user", "login_at"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_user_login_history");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tbl_user_login_history_status";'
    );
  },
};
