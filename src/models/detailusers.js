'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailUsers.init({
    id: DataTypes.UUID,
    uuid_user: DataTypes.UUID,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    link_pict: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DetailUsers',
  });
  return DetailUsers;
};