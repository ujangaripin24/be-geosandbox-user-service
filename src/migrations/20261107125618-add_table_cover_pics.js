'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (!table.link_cover_pics) {
      await queryInterface.addColumn('tbl_detail_users', 'link_cover_pics', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'link_pict'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('tbl_detail_users');
    if (table.link_cover_pics) {
      await queryInterface.removeColumn('tbl_detail_users', 'link_cover_pics');
    }
  }
};
