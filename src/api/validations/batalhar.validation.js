const Joi = require('joi');

module.exports = {
  // POST /batalhar/:idPokemon1/:idPokemon2
  batalhar: {
    params: {
      idPokemon1: Joi.number().required(),
      idPokemon2: Joi.number().required(),
    },
  },
};
