'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TblAddressUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TblAddressUsers.belongsTo(models.DetailUsers, {
        foreignKey: 'uuid_user',
        targetKey: 'uuid_user',
        as: 'user'
      });
    }
  }
  TblAddressUsers.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    uuid_user: {
      type: DataTypes.UUID,
      allowNull: false
    },
    negara: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kota: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provinsi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kode_pos: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TblAddressUsers',
    tableName: 'tbl_address_users',
    timestamps: true
  });
  return TblAddressUsers;
};