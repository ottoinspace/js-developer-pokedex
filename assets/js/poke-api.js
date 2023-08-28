
const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.baseExperience = pokeDetail.base_experience;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    const [ability] = abilities;

    pokemon.abilities = abilities;
    pokemon.ability = ability;

    const moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name);
    const [move] = moves;

    pokemon.moves = moves;
    pokemon.move = move;

    const stats = pokeDetail.stats.map((statSlot) => statSlot.base_stat);
    const [stat] = stats;

    pokemon.stats = stats;
    pokemon.stat = stat;

    return pokemon;
}

pokeApi.getPokemonDetail = async (pokemon) => {
    try{
    return await fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
    }catch(e){
        console.log(e);
    }
}

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    try{
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

        return await fetch(url)
            .then((response) => response.json())
            .then((jsonBody) => jsonBody.results)
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
            .then((detailRequests) => Promise.all(detailRequests))
            .then((pokemonsDetails) => pokemonsDetails);
    }catch(e){
        console.log(e);
    }
}
