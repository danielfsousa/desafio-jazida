const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const tiposPermitidos = ['charizard', 'mewtwo', 'pikachu'];

const Pokemon = sequelize.define('pokemon', {
  tipo: {
    type: DataTypes.ENUM(tiposPermitidos),
    allowNull: false,
    set(tipo) {
      this.setDataValue('tipo', tipo.toLowerCase());
    },
  },
  treinador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, { timestamps: false });

Pokemon.getTiposPermitidos = () => tiposPermitidos;

module.exports = Pokemon;
