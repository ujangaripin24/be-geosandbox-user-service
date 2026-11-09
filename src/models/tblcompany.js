'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TblCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TblCompany.init({
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    geom: DataTypes.STRING,
    link_location_company: DataTypes.STRING,
    instagram: DataTypes.STRING,
    tiktok: DataTypes.STRING,
    facebook: DataTypes.STRING,
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TblCompany',
  });
  return TblCompany;
};