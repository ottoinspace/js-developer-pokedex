const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const back = document.querySelector('.back');
const card = document.querySelector('.card');

const maxRecords = 649
const limit = 20
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="loadPokemonCard(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

function buildCard(pokemon) {
    return `
    <header class="pokemonHeader">
        <button class="back" onclick="closeCard(${pokemon.number})">
            <img src="./assets/img/arrow.png" alt="Voltar">
        </button>

        <div class="infos">
            <div class="detail">
                <span class="name">${pokemon.name}</span>
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>

            <span class="number">#${pokemon.number}</span>
        </div>

        <img class="photo" src="${pokemon.photo}" alt="${pokemon.name}">
    <header>

    <section class="cardDetails">
        <ul class="cardMenu">
            <li>
                <h2>About</h2>
                <div class="about">
                <div><label class="text-gray">Base. Exp.</label> <label>${pokemon.baseExperience} exp.</label></div>
                <div><label class="text-gray">Height</label> <label class="height">${pokemon.height}</label></div>
                <div><label class="text-gray">Weight</label> <label class="weight">${pokemon.weight}</label></div>
                <div><label class="text-gray">Abilities</label> <label class="abilities">${pokemon.abilities.map((ability) => `${ability}`).join(', ')}</label></div>
                </div>                
            </li>

            <li>
                <h2>Base Stats</h2>
                <div id="menu2" class="about">
                <div class="hp">
                    <label class="text-gray">HP</label>
                    <div class="stat-value">${pokemon.stats[0]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
                <div class="atk">
                    <label class="text-gray">Attack</label>
                    <div class="stat-value">${pokemon.stats[1]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
                <div class="dfs">
                    <label class="text-gray">Defense</label>
                    <div class="stat-value">${pokemon.stats[2]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
                <div class="sp-atk">
                    <label class="text-gray">Sp. Atk.</label>
                    <div class="stat-value">${pokemon.stats[3]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
                <div class="sp-def">
                    <label class="text-gray">Sp. Def.</label>
                    <div class="stat-value">${pokemon.stats[4]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
                <div class="spd">
                    <label class="text-gray">Speed</label>
                    <div class="stat-value">${pokemon.stats[5]}</div> 
                    <div class="health-bar">
                        <div class="bar-red bar-width"></div>
                    </div>
                </div>
            </li>
        </ul>
    </section>
    `
}

function loadPokemonCard(pokemonId) {
    pokeApi.getPokemons((pokemonId - 1), 1).then((pokemonData) => {
        if (pokemonData.length > 0) {
            const pokemon = pokemonData[0];
            const newHtml = buildCard(pokemon);
            card.style.display = 'block';
            card.classList.add(`${pokemon.type}`);
            card.innerHTML += newHtml;

            barColors(pokemon);
        } else {
            console.error("No Pokemon data found for the provided ID.");
        }
    })
}

function closeCard(pokemonId) {
    pokeApi.getPokemons((pokemonId - 1), 1).then((pokemonData) => {
        card.classList.remove(`${pokemonData[0].type}`);
        card.style.display = 'none';
        card.innerHTML = "";
    });
}

function barColors(pokemon) {
    console.log('barColors called');
    let colorBars = document.querySelectorAll('.bar-width');
    console.log("Color bars:", colorBars);
    let maxWidthBar = 200, maxAttribute = 225;

    for (let i = 0; i < colorBars.length; i++) {
        let colorBar = colorBars[i];

        if (pokemon.stats[i] > 75) {
            colorBar.classList.add("bar-green");
            colorBar.classList.remove("bar-red");
        } else {
            colorBar.classList.add("bar-red");
            colorBar.classList.remove("bar-green");
        }

        let newWidthBar = (pokemon.stats[i] * maxWidthBar) / maxAttribute;
        colorBar.style.width = newWidthBar + 'px';
    }
}
