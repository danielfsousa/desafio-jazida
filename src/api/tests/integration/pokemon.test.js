/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const { some } = require('lodash');
const app = require('../../../index');
const Pokemon = require('../../models/pokemon.model');

describe('Pokemons API', () => {
  let dbPokemons;
  let pokemon;

  beforeEach(() => {
    dbPokemons = {
      pikachu: {
        id: 1,
        tipo: 'pikachu',
        treinador: 'Daniel',
      },
      mewtwo: {
        id: 2,
        tipo: 'mewtwo',
        treinador: 'Daniel',
      },
    };

    pokemon = {
      tipo: 'charizard',
      treinador: 'Ash Ketchum',
    };

    return Pokemon.destroy({ where: { id: { gt: 0 } } })
      .then(() => Pokemon.bulkCreate([dbPokemons.pikachu, dbPokemons.mewtwo]))
      .catch(console.error);
  });

  describe('POST /pokemons', () => {
    it('should create a new pokemon when request is ok', () => {
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.have.a.property('id');
          expect(res.body).to.have.a.property('tipo');
          expect(res.body).to.have.a.property('treinador');
          expect(res.body).to.have.a.property('nivel');
          expect(res.body).to.include(pokemon);
        });
    });

    it('should create a new pokemon and set "nivel" to 1', () => {
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.nivel).to.be.equal(1);
        });
    });

    it('should not change the "nivel" of the pokemon', () => {
      pokemon.nivel = 100;
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.nivel).to.be.equal(1);
        });
    });

    it('should transform the property "tipo" to lowercase', () => {
      pokemon.tipo = 'PIKACHU';
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.tipo).to.be.equal('pikachu');
        });
    });

    it('should report error when "tipo" is not provided', () => {
      delete pokemon.tipo;
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('tipo');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"tipo" is required');
        });
    });

    it('should report error when "tipo" is not one of the allowed types', () => {
      pokemon.tipo = 'not_allowed';
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const allowedTypes = Pokemon.getTiposPermitidos();
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(pokemon.tipo).to.not.be.oneOf(allowedTypes);
          expect(field).to.be.equal('tipo');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"tipo" must be one of [charizard, mewtwo, pikachu]');
        });
    });

    it('should report error when "treinador" is not provided', () => {
      delete pokemon.treinador;
      return request(app)
        .post('/pokemons')
        .send(pokemon)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('treinador');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"treinador" is required');
        });
    });
  });

  describe('GET /pokemons', () => {
    it('should get all pokemons', () => {
      return request(app)
        .get('/pokemons')
        .expect(httpStatus.OK)
        .then(async (res) => {
          const includesPokemons = (
            some(res.body, dbPokemons.pikachu) || some(res.body, dbPokemons.mewtwo)
          );

          expect(res.body[0]).to.have.a.property('id');
          expect(res.body[0]).to.have.a.property('tipo');
          expect(res.body[0]).to.have.a.property('treinador');
          expect(res.body[0]).to.have.a.property('nivel');
          expect(includesPokemons).to.be.true;
        });
    });
  });

  describe('GET /pokemons/:pokemonId', () => {
    it('should get pokemon', async () => {
      return request(app)
        .get('/pokemons/1')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('id');
          expect(res.body).to.have.a.property('tipo');
          expect(res.body).to.have.a.property('treinador');
          expect(res.body).to.have.a.property('nivel');
        });
    });

    it('should report error "Pokemon não encontrado" when id could not be found', () => {
      return request(app)
        .get('/pokemons/5651658')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Pokemon não encontrado');
        });
    });

    it('should report error when id is not valid', () => {
      return request(app)
        .get('/pokemons/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('pokemonId');
          expect(location).to.be.equal('params');
          expect(messages).to.include('"pokemonId" must be a number');
        });
    });
  });

  describe('PUT /pokemons/:pokemonId', () => {
    it('should update just the property "treinador"', async () => {
      pokemon.nivel = 100;
      return request(app)
        .put('/pokemons/1')
        .send(pokemon)
        .expect(httpStatus.NO_CONTENT)
        .then(async () => {
          const dbPokemon = await Pokemon.findById(1);
          expect(dbPokemon.treinador).to.be.equal(pokemon.treinador);
          expect(dbPokemon.tipo).to.not.be.equal(pokemon.tipo);
          expect(dbPokemon.nivel).to.not.be.equal(100);
        });
    });

    it('should report error when "treinador" is not provided', async () => {
      return request(app)
        .put('/pokemons/1')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('treinador');
          expect(location).to.be.equal('body');
          expect(messages).to.include('"treinador" is required');
        });
    });

    it('should report error "Pokemon não encontrado" when id could not be found', () => {
      return request(app)
        .put('/pokemons/12354848')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Pokemon não encontrado');
        });
    });

    it('should report error when id is not valid', () => {
      return request(app)
        .put('/pokemons/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('pokemonId');
          expect(location).to.be.equal('params');
          expect(messages).to.include('"pokemonId" must be a number');
        });
    });
  });

  describe('DELETE /pokemons', () => {
    it('should delete pokemon', async () => {
      return request(app)
        .delete('/pokemons/1')
        .expect(httpStatus.NO_CONTENT)
        .then(async () => {
          const pokemons = await Pokemon.findAll();
          expect(pokemons).to.have.lengthOf(1);
        });
    });

    it('should report error "Pokemon não encontrado" when id could not be found', () => {
      return request(app)
        .delete('/pokemons/123548')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
          expect(res.body.message).to.be.equal('Pokemon não encontrado');
        });
    });

    it('should report error when id is not valid', () => {
      return request(app)
        .delete('/pokemons/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('pokemonId');
          expect(location).to.be.equal('params');
          expect(messages).to.include('"pokemonId" must be a number');
        });
    });
  });
});
