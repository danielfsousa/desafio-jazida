const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/batalhar.controller');
const { batalhar } = require('../validations/batalhar.validation');

const router = express.Router();

router
  .route('/:idPokemon1/:idPokemon2')
  /**
   * @api {post} batalhar/:idPokemon1/:idPokemon2 Batalhar
   * @apiDescription Batalha de Pokemons
   * @apiVersion 0.1.0
   * @apiName Batalhar
   * @apiGroup Batalhar
   * 
   * @apiSuccess {Object}   vencedor            Pokemon vencedor
   * @apiSuccess {Integer}  vencedor.id         id do Pokemon vencedor
   * @apiSuccess {String}   vencedor.tipo       tipo do Pokemon vencedor
   * @apiSuccess {String}   vencedor.treinador  treinador do Pokemon vencedor
   * @apiSuccess {Integer}  vencedor.nivel      nível do Pokemon vencedor
   * 
   * @apiSuccess {Object}   perdedor            Pokemon perdedor
   * @apiSuccess {Integer}  perdedor.id         id do Pokemon perdedor
   * @apiSuccess {String}   perdedor.tipo       tipo do Pokemon perdedor
   * @apiSuccess {String}   perdedor.treinador  treinador do Pokemon perdedor
   * @apiSuccess {Integer}  perdedor.nivel      nível do Pokemon perdedor
   * 
   * @apiSuccessExample {json} Sucesso
   *   {
   *     "vencedor": {
   *       "id": 1,
   *       "tipo": "pikachu",
   *       "treinador": "Thiago",
   *       "nivel": 2
   *     },
   *     "perdedor": {
   *       "id": 2,
   *       "tipo": "charizard",
   *       "treinador": "Renato",
   *       "nivel": 0
   *     }
   *   }
   *
   * @apiError (Bad Request 400)  ErroValidacao  ID(s) Inválido(s)
   */
  .post(validate(batalhar), controller.batalhar);

module.exports = router;
