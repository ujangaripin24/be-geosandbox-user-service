"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("tbl_detail_users");

    if (!table.uuid_company) {
      await queryInterface.addColumn("tbl_detail_users", "uuid_company", {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      });
    } else {
      await queryInterface.sequelize.query(`
        ALTER TABLE "tbl_detail_users"
        ALTER COLUMN "uuid_company" TYPE UUID USING "uuid_company"::uuid,
        ALTER COLUMN "uuid_company" DROP NOT NULL,
        ALTER COLUMN "uuid_company" SET DEFAULT NULL;
      `);
    }

    const [constraints] = await queryInterface.sequelize.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'tbl_detail_users'
        AND constraint_name = 'fk_tbl_detail_users_uuid_company';
    `);

    if (constraints.length === 0) {
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
    }
  },

  async down(queryInterface, Sequelize) {
    const [constraints] = await queryInterface.sequelize.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'tbl_detail_users'
        AND constraint_name = 'fk_tbl_detail_users_uuid_company';
    `);

    if (constraints.length > 0) {
      await queryInterface.removeConstraint(
        "tbl_detail_users",
        "fk_tbl_detail_users_uuid_company",
      );
    }

    const table = await queryInterface.describeTable("tbl_detail_users");
    if (table.uuid_company) {
      await queryInterface.removeColumn("tbl_detail_users", "uuid_company");
    }
  },
};
