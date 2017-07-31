const Joi = require('joi');
const Pokemon = require('../models/pokemon.model');

const tiposPermitidos = Pokemon.getTiposPermitidos();

module.exports = {
  // when param :pokemonId is hit
  loadPokemon: {
    params: {
      pokemonId: Joi.number().integer().required(),
    },
  },

  // POST /pokemons
  createPokemon: {
    body: {
      tipo: Joi.string().lowercase().only(tiposPermitidos).required(),
      treinador: Joi.string().required(),
    },
  },

  // PUT /pokemons/:pokemonId
  updatePokemon: {
    params: {
      pokemonId: Joi.number().required(),
    },
    body: {
      treinador: Joi.string().required(),
    },
  },

  // DELETE /pokemons/:pokemonId
  deletePokemon: {
    params: {
      pokemonId: Joi.number().required(),
    },
  },
};
