'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TblUserLoginHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      ip_address: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      browser: {
        type: Sequelize.STRING
      },
      os: {
        type: Sequelize.STRING
      },
      geom: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      login_at: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TblUserLoginHistories');
  }
};