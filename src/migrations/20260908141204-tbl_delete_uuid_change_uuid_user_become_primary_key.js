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
    await queryInterface.removeColumn('tbl_detail_users', 'uuid');

    await queryInterface.renameColumn('tbl_detail_users', 'uuid_user', 'uuid');

    await queryInterface.changeColumn('tbl_detail_users', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
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
};
