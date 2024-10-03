const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: { type: DataTypes.STRING, unique: true, alowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  firstname: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
});

const Card = sequelize.define("card", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  header: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING(5000), allowNull: false },
  src: { type: DataTypes.STRING, allowNull: false },
});

module.exports = {
  User,
  Card,
};
