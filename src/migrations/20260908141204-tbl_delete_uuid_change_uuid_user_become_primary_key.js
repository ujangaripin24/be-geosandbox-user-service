'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (table.uuid_user) {
      if (table.uuid) {
        await queryInterface.removeColumn('tbl_detail_users', 'uuid');
      }

      await queryInterface.renameColumn('tbl_detail_users', 'uuid_user', 'uuid');

      await queryInterface.changeColumn('tbl_detail_users', 'uuid', {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (!table.uuid_user && table.uuid) {
      await queryInterface.changeColumn('tbl_detail_users', 'uuid', {
        type: Sequelize.UUID,
        allowNull: true,
        primaryKey: false,
        unique: false
      });

      await queryInterface.renameColumn('tbl_detail_users', 'uuid', 'uuid_user');

      await queryInterface.addColumn('tbl_detail_users', 'uuid', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      });
    }
  }
};
