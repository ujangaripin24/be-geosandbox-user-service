"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TblUserLoginHistory extends Model {
    static associate(models) {
      TblUserLoginHistory.belongsTo(models.DetailUsers, {
        foreignKey: "uuid_user",
        targetKey: "uuid",
        as: "user",
      });
    }
  }

  TblUserLoginHistory.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      uuid_user: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Unknown",
      },
      device: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Desktop",
      },
      browser: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Unknown Browser",
      },
      os: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Unknown OS",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("SUCCESS", "FAILED"),
        defaultValue: "SUCCESS",
        allowNull: false,
      },
      failure_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      login_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TblUserLoginHistory",
      tableName: "tbl_user_login_history",
      timestamps: true,
    }
  );

  return TblUserLoginHistory;
};
