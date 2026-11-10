"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailUsers.hasMany(models.TblUserLoginHistory, {
        foreignKey: "uuid_user",
        sourceKey: "uuid",
        as: "loginHistories",
      });
      DetailUsers.hasMany(models.TblAddressUsers, {
        foreignKey: "uuid_user",
        sourceKey: "uuid",
        as: "addresses",
      });
      if (models.TblCompany) {
        DetailUsers.belongsTo(models.TblCompany, {
          foreignKey: "uuid_company",
          targetKey: "uuid",
          as: "company",
        });
      }
    }
  }
  DetailUsers.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_pict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_cover_pics: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("SUPERADMIN", "ADMIN", "USER", "GUEST"),
        defaultValue: "GUEST",
        allowNull: false,
      },
      uuid_company: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      event_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DetailUsers",
      tableName: "tbl_detail_users",
      timestamps: true,
    },
  );
  return DetailUsers;
};
