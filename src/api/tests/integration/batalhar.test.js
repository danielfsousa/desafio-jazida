/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../index');
const Pokemon = require('../../models/pokemon.model');

describe('Batalhar API', () => {
  let dbPokemons;
  let pokemon;

  beforeEach(() => {
    dbPokemons = {
      pikachu: {
        id: 1,
        tipo: 'pikachu',
        treinador: 'Daniel',
        nivel: 10000000,
      },
      mewtwo: {
        id: 2,
        tipo: 'mewtwo',
        treinador: 'Daniel',
        nivel: 1,
      },
      charizard: {
        id: 3,
        tipo: 'charizard',
        treinador: 'Daniel',
        nivel: 2,
      },
    };

    pokemon = {
      tipo: 'charizard',
      treinador: 'Ash Ketchum',
    };

    return Pokemon.destroy({ where: { id: { gt: 0 } } })
      .then(() => Pokemon.bulkCreate([dbPokemons.pikachu, dbPokemons.mewtwo, dbPokemons.charizard]))
      .catch(console.error);
  });

  describe('POST /batalhar/:pokemonId1/:pokemonId2', () => {
    it('should respond with the battle\'s results', () => {
      return request(app)
        .post('/batalhar/1/2')
        .send(pokemon)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.a.property('vencedor');
          expect(res.body).to.have.a.property('perdedor');
          // vencedor
          expect(res.body.vencedor).to.have.a.property('id');
          expect(res.body.vencedor).to.have.a.property('tipo');
          expect(res.body.vencedor).to.have.a.property('treinador');
          expect(res.body.vencedor).to.have.a.property('nivel');
          // perdedor
          expect(res.body.perdedor).to.have.a.property('id');
          expect(res.body.perdedor).to.have.a.property('tipo');
          expect(res.body.perdedor).to.have.a.property('treinador');
          expect(res.body.perdedor).to.have.a.property('nivel');
        });
    });

    it('should increase the winners\'s "nivel" and decrease the loser\'s "nivel"', () => {
      return request(app)
        .post('/batalhar/1/3')
        .send(pokemon)
        .expect(httpStatus.OK)
        .then(async (res) => {
          const vencedor = await Pokemon.findById(res.body.vencedor.id);
          const perdedor = await Pokemon.findById(res.body.perdedor.id);
          expect(res.body.vencedor.nivel).to.be.equal(dbPokemons.pikachu.nivel + 1);
          expect(res.body.perdedor.nivel).to.be.equal(dbPokemons.charizard.nivel - 1);
          expect(vencedor.nivel).to.be.equal(dbPokemons.pikachu.nivel + 1);
          expect(perdedor.nivel).to.be.equal(dbPokemons.charizard.nivel - 1);
        });
    });

    it('should delete the loser if its "nivel" is equal to 0', () => {
      pokemon.nivel = 100;
      return request(app)
        .post('/batalhar/1/2')
        .send(pokemon)
        .expect(httpStatus.OK)
        .then(async (res) => {
          const { id } = res.body.perdedor;
          const pokemonPerdedor = await Pokemon.findById(id);
          expect(pokemonPerdedor).to.not.exist;
        });
    });

    it('should report error when id could not be found', () => {
      return request(app)
        .post('/batalhar/9999/9999')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.code).to.be.equal(404);
        });
    });

    it('should report error when id is not valid', () => {
      return request(app)
        .post('/batalhar/aaa/222')
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          const field = res.body.errors[0].field;
          const location = res.body.errors[0].location;
          const messages = res.body.errors[0].messages;
          expect(field).to.be.equal('idPokemon1');
          expect(location).to.be.equal('params');
          expect(messages).to.include('"idPokemon1" must be a number');
        });
    });
  });
});
