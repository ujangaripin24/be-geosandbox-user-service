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

    if (!table.uuid_company) {
      await queryInterface.addColumn("tbl_detail_users", "uuid_company", {
        type: Sequelize.UUID,
        allowNull: true,
      });
    } else {
      await queryInterface.sequelize.query(`
        ALTER TABLE "tbl_detail_users"
        ALTER COLUMN "uuid_company" TYPE UUID USING "uuid_company"::uuid;
      `);
    }

    if (!table.event_type) {
      await queryInterface.addColumn("tbl_detail_users", "event_type", {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
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
    if (table.event_type) {
      await queryInterface.removeColumn("tbl_detail_users", "event_type");
    }
    if (table.role) {
      await queryInterface.removeColumn("tbl_detail_users", "role");
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_tbl_detail_users_role";',
      );
    }
  },
};
