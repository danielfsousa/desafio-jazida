/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const WeightedRandom = require('../../utils/WeightedRandom');

const { expect } = chai;
chai.use(sinonChai);

describe('WeightedRandom', () => {
  const pokemons = [
    {
      id: 1,
      tipo: 'pikachu',
      treinador: 'Daniel',
      nivel: 1,
    },
    {
      id: 2,
      tipo: 'mewtwo',
      treinador: 'Daniel',
      nivel: 2,
    },
  ];

  const probs = [
    {
      weight: 0.66,
      value: pokemons[0],
    },
    {
      weight: 0.34,
      value: pokemons[1],
    },
  ];

  function mockWeightedRandom() {
    // necessary because: 
    // https://stackoverflow.com/questions/32550115/mocking-javascript-constructor-with-sinon-js
    const namespace = {
      WeightedRandom: require('../../utils/WeightedRandom'), // eslint-disable-line
    };

    const fakeWeightedRandom = {
      decimals: [0.66, 1],
      probabilities: [
        {
          weight: 0.66,
          value: 0,
        },
        {
          weight: 0.34,
          value: 1,
        },
      ],
      WeightedRandom: () => true,
      get: namespace.WeightedRandom.prototype.get,
      fromPokemons: namespace.WeightedRandom.fromPokemons,
    };

    sinon.stub(namespace, 'WeightedRandom').returns(fakeWeightedRandom);
    return new namespace.WeightedRandom();
  }

  describe('constructor()', () => {
    it('should accept an array of probabilities', () => {
      const instance = new WeightedRandom(probs);
      expect(instance.probabilities).to.have.lengthOf(2);
    });

    it('should accept more than one probability passed by arguments', () => {
      const instance = new WeightedRandom(probs[0], probs[1]);
      expect(instance.probabilities).to.have.lengthOf(2);
    });

    it('should sum the weights', () => {
      const instance = new WeightedRandom(probs);
      expect(instance.sum).to.be.equal(1);
    });

    it('should keep weights as decimals', () => {
      const instance = new WeightedRandom(probs);
      expect(instance.decimals[0]).to.be.equal(probs[0].weight);
      expect(instance.decimals[1]).to.be.equal(1);
    });

    it('should throw error if the sum of weights is not equal to 1', () => {
      const wrongWeight = {
        weight: 10,
        value: '',
      };
      const wrapper = () => new WeightedRandom(...probs, wrongWeight);

      expect(wrapper).to.throw();
    });
  });

  describe('fromPokemons()', () => {
    it('should create probability objects when given an array of objects', () => {
      const { probabilities } = WeightedRandom.fromPokemons(pokemons);
      expect(probabilities).to.be.lengthOf(2);
      expect(probabilities[0].value).to.be.equal(pokemons[0]);
      expect(probabilities[1].value).to.be.equal(pokemons[1]);
    });

    it('should create probability objects when given more than one object', () => {
      const { probabilities } = WeightedRandom.fromPokemons(pokemons[0], pokemons[1]);
      expect(probabilities).to.be.lengthOf(2);
      expect(probabilities[0].value).to.be.equal(pokemons[0]);
      expect(probabilities[1].value).to.be.equal(pokemons[1]);
    });
  });

  describe('get()', () => {
    it('should call Math.random()', () => {
      const spy = sinon.spy(Math, 'random');
      const mock = mockWeightedRandom();
      mock.get();

      expect(spy).to.be.calledOnce;
      spy.restore();
    });

    it('should return a random winner based on weights', () => {
      const count = [0, 0];
      const mock = mockWeightedRandom();

      for (let i = 0; i < 1000; i += 1) {
        const winner = mock.get();
        count[winner] += 1;
      }

      // expect 66% with an error margin of 5%
      expect(count[0]).to.be.within(610, 710);

      // expect 34% with an error margin of 5%
      expect(count[1]).to.be.within(290, 390);
    });
  });
});
