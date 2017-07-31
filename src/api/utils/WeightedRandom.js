class WeightedRandom {
  /**
   * Creates an instance of WeightedRandom.
   * @param {...object|object[]} probabilities
   * @param {number} probabilities[].weight The probability as a percentage‎
   * @param {any} probabilities[].value The value to be chosen
   * @memberof Probability
   */
  constructor(...probabilities) {
    // checks if the first probability is an object or an array of objects
    // so, it can be used as WeightedRandom(obj1, obj2) or WeightedRandom([obj1, obj2])
    this.probabilities = Array.isArray(probabilities[0]) ? probabilities[0] : probabilities;

    // sum of weights (must be 1)
    this.sum = 0;

    // weights as decimals. Ex: 80% = 0.8
    this.decimals = [];

    this.probabilities.forEach((prob, index) => {
      // concatenate weight in decimals to sum
      this.sum += prob.weight;
      // push current sum to decimals array
      this.decimals[index] = this.sum;
    });

    // throw error if the sum of weights is not 1
    if (this.sum !== 1) {
      throw new Error(`The sum of weights must be 1. Current sum: ${this.sum}`);
    }

    return this;
  }

  /**
   * Creates an instance of WeightedRandom from an array of Pokemons
   * 
   * @static
   * @param {...pokemon|pokemon[]} pokemons
   * @return {WeightedRandom} WeightedRandom instance
   * @memberof WeightedRandom
   */
  static fromPokemons(...pokemons) {
    // checks if the first probability is an object or an array of objects
    // so, it can be used as:
    // WeightedRandom.fromPokemons(obj1, obj2) or WeightedRandom.fromPokemons([obj1, obj2])
    const pokemonsCopy = Array.isArray(pokemons[0]) ? pokemons[0] : pokemons;

    const outcomes = pokemonsCopy.reduce((accumulator, pokemon) => accumulator + pokemon.nivel, 0);

    const probabilityObjects = pokemonsCopy.map(pokemon => ({
      weight: pokemon.nivel / outcomes,
      value: pokemon,
    }));

    return new WeightedRandom(probabilityObjects);
  }

  /**
   * Return the value of the randomly chosen probability object
   * 
   * @memberof Probability
   * @return {any} Value
   */
  get() {
    // pick a random decimal
    const random = Math.random();

    // choose one object based on a random number and its weight
    let i = 0;
    while (i < this.decimals.length && random >= this.decimals[i]) {
      i += 1;
    }

    // return the value of the randomly chosen object
    return this.probabilities[i].value;
  }
}

module.exports = WeightedRandom;
