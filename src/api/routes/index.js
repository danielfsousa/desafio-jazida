const express = require('express');
const pokemonRoutes = require('./pokemon.route');
const batalharRoutes = require('./batalhar.route');

const router = express.Router();

// mount routes
router.use('/pokemons', pokemonRoutes);
router.use('/batalhar', batalharRoutes);
router.use('/documentacao', express.static('docs'));

module.exports = router;
