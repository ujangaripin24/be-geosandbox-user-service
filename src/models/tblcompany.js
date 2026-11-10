"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TblCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.DetailUsers) {
        TblCompany.hasMany(models.DetailUsers, {
          foreignKey: "uuid_company",
          sourceKey: "uuid",
          as: "users",
        });
      }
    }
  }
  TblCompany.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link_location_company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tiktok: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TblCompany",
      tableName: "tbl_companies",
      timestamps: true,
    },
  );
  return TblCompany;
};