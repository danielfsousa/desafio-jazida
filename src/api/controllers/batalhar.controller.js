const httpStatus = require('http-status');
const Pokemon = require('../models/pokemon.model');
const WeightedRandom = require('../utils/WeightedRandom');
const APIError = require('../utils/APIError');
const sequelize = require('../../config/database');

function formatErrorMessage(pokemon1, pokemon2) {
  let message;
  if (!pokemon1 && !pokemon2) {
    message = 'Pokemons 1 e 2 não encontrados';
  } else {
    const numPokemon = !pokemon1 ? 1 : 2;
    message = `Pokemon ${numPokemon} não encontrado`;
  }
  return message;
}

/**
 * Pokemons' battle
 * @public
 */
exports.batalhar = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    // find pokemons
    const { idPokemon1, idPokemon2 } = req.params;
    const pokemon1 = await Pokemon.findById(idPokemon1);
    const pokemon2 = await Pokemon.findById(idPokemon2);

    // if pokemons could not be found, then throw error
    if (!pokemon1 || !pokemon2) {
      throw new APIError({
        message: formatErrorMessage(pokemon1, pokemon2),
        status: httpStatus.NOT_FOUND,
      });
    }

    // choose the winner
    const vencedor = WeightedRandom.fromPokemons(pokemon1, pokemon2).get();
    const perdedor = vencedor.id === pokemon1.id ? pokemon2 : pokemon1;

    // increase winner's level 
    vencedor.nivel += 1;
    await vencedor.save({ transaction: t });

    // decrease loser's level
    perdedor.nivel -= 1;

    // if the loser's level is equal to 0
    // then delete the pokemon from the database
    if (perdedor.nivel === 0) {
      await perdedor.destroy({ transaction: t });
    } else {
      await perdedor.save({ transaction: t });
    }

    // commit database transaction
    await t.commit();

    // send results
    res.send({ vencedor, perdedor });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
