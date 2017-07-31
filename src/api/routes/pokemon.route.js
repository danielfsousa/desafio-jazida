const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/pokemon.controller');
const {
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require('../validations/pokemon.validation');

const router = express.Router();

/**
 * Load pokemon when API with pokemonId route parameter is hit
 */
router.param('pokemonId', controller.load);

router
  .route('/')
  /**
   * @api {get} pokemons Listar
   * @apiVersion 0.1.0
   * @apiName ListarPokemons
   * @apiGroup Pokemon
   *
   * @apiSuccess {Object[]} pokemon            Lista de pokemons
   * @apiSuccess {Integer}  pokemon.id         id do Pokemon
   * @apiSuccess {String}   pokemon.tipo       tipo do Pokemon
   * @apiSuccess {String}   pokemon.treinador  treinador do Pokemon
   * @apiSuccess {Integer}  pokemon.nivel      nível do Pokemon
   *
   * @apiSuccessExample {json} Sucesso
   *   [{
   *     "id": 1,
   *     "tipo": "pikachu",
   *     "treinador": "Thiago",
   *     "nivel": 1
   *   }, {
   *     "id": 2,
   *     "tipo": "charizard",
   *     "treinador": "Renato",
   *     "nivel": 1
   *   }]
   */
  .get(controller.list)
  /**
   * @api {post} pokemons Criar
   * @apiVersion 0.1.0
   * @apiName CriarPokemon
   * @apiGroup Pokemon
   *
   * @apiParam  {String}  tipo       Tipo do pokemon
   * @apiParam  {String}  treinador  Treinador do pokemon
   *
   * @apiSuccess {Integer}  id         id do Pokemon
   * @apiSuccess {String}   tipo       tipo do Pokemon
   * @apiSuccess {String}   treinador  treinador do Pokemon
   * @apiSuccess {Integer}  nivel      nível do Pokemon vencedor
   *
   * @apiSuccessExample {json} Sucesso
   *   {
   *     "id": 1,
   *     "tipo": "pikachu",
   *     "treinador": "Thiago",
   *     "nivel": 1
   *   }
   *
   * @apiError (Bad Request 400)  ErroValidacao  Alguns parâmetros podem conter valores inválidos
   */
  .post(validate(createPokemon), controller.create);


router
  .route('/:pokemonId')
  /**
   * @api {get} pokemons/:id Carregar
   * @apiVersion 0.1.0
   * @apiName CarregarPokemon
   * @apiGroup Pokemon
   *
   * @apiSuccess {Integer}  id         id do Pokemon
   * @apiSuccess {String}   tipo       tipo do Pokemon
   * @apiSuccess {String}   treinador  treinador do Pokemon
   * @apiSuccess {Integer}  nivel      nível do Pokemon vencedor
   *
   * @apiError (Not Found 404)  NaoEncontrado  O Pokemon não foi encontrado
   */
  .get(controller.get)
  /**
   * @api {put} pokemons/:id Alterar
   * @apiVersion 0.1.0
   * @apiName AlterarPokemon
   * @apiGroup Pokemon
   *
   * @apiParam  {String}  treinador  Treinador do pokemon
   *
   * @apiSuccess (No Content 204) - Pokemon alterado
   *
   * @apiError (Bad Request 400)  ErroValidacao  Alguns parâmetros podem conter valores inválidos
   * @apiError (Not Found 404)  NaoEncontrado  O Pokemon não foi encontrado
   */
  .put(validate(updatePokemon), controller.update)
  /**
   * @api {delete} pokemons/:id Deletar
   * @apiVersion 0.1.0
   * @apiName DeletarPokemon
   * @apiGroup Pokemon
   *
   * @apiSuccess (No Content 204) - Pokemon excluído
   *
   * @apiError (Not Found 404)  NaoEncontrado  O Pokemon não foi encontrado
   */
  .delete(validate(deletePokemon), controller.remove);


module.exports = router;
