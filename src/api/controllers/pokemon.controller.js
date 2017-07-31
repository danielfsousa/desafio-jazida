const httpStatus = require('http-status');
const validate = require('express-validation');
const Pokemon = require('../models/pokemon.model');
const APIError = require('../utils/APIError');
const { handler: errorHandler } = require('../middlewares/error');
const { loadPokemon } = require('../validations/pokemon.validation');

function validateID(req, res, next, id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed)) {
    return validate(loadPokemon)(req, res, next);
  }
  return true;
}

/**
 * Load pokemon and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  validateID(req, res, next, id);
  try {
    const pokemon = await Pokemon.findById(id);
    if (!pokemon) {
      throw new APIError({
        message: 'Pokemon não encontrado',
        status: httpStatus.NOT_FOUND,
      });
    }
    req.locals = { pokemon };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get pokemon
 * @public
 */
exports.get = (req, res) => res.json(req.locals.pokemon);

/**
 * Create new pokemon
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { tipo, treinador } = req.body;
    const pokemon = await Pokemon.create({ tipo, treinador });
    res.status(httpStatus.CREATED);
    res.send(pokemon);
  } catch (error) {
    next(error);
  }
};

/**
 * Update the property "treinador" of an existing pokemon
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { pokemon } = req.locals;
    const { treinador } = req.body;
    await pokemon.update({ treinador });
    res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

/**
 * List pokemons
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const pokemons = await Pokemon.all();
    res.send(pokemons);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pokemon
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { pokemon } = req.locals;
    await pokemon.destroy();
    res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
