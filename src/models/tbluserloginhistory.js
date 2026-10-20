'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TblUserLoginHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TblUserLoginHistory.init({
    uuid: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    device: DataTypes.STRING,
    device: DataTypes.STRING,
    browser: DataTypes.STRING,
    os: DataTypes.STRING,
    geom: DataTypes.STRING,
    status: DataTypes.STRING,
    login_at: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TblUserLoginHistory',
  });
  return TblUserLoginHistory;
};