const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

// Busca um Pokémon específico por nome ou número
const fetchSinglePokemon = async query => {
  try {
    const response = await fetch(getPokemonUrl(query.toLowerCase()))
    if (!response.ok) throw new Error("Pokémon não encontrado")
    const pokemon = await response.json()
    insertPokemonsIntoPage(generateHTML([pokemon]))
  } catch (error) {
    alert(error.message)
  }
}

// Gera promessas para os 151 Pokémon
const generatePokemonPromises = () =>
  Array(1025).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json())
  )

// Gera o HTML dos cards
const generateHTML = pokemons => {
  return pokemons.reduce((accumulator, { name, id, types, sprites }) => {
    const elementTypes = types.map(typeInfo => typeInfo.type.name)
    const imageUrl = sprites.front_default

    accumulator += `
      <li class="card ${elementTypes[0]}">
        <img class="card-image" alt="${name}" src="${imageUrl}" />
        <h2 class="card-title">${id}. ${name}</h2>
        <p class="card-subtitle">${elementTypes.join(" | ")}</p>
      </li>
    `
    return accumulator
  }, "")
}

// Insere os cards na página
const insertPokemonsIntoPage = html => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML = html
}

// Inicializa a Pokédex completa
const loadAllPokemons = () => {
  const pokemonPromises = generatePokemonPromises()
  Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonsIntoPage)
}

// Escuta o formulário de busca
const setupSearch = () => {
  const form = document.querySelector('[data-js="search-form"]')
  const input = document.querySelector('[data-js="search-input"]')

  form.addEventListener("submit", event => {
    event.preventDefault()
    const query = input.value.trim()
    if (query) fetchSinglePokemon(query)
  })
}

// Executa tudo
loadAllPokemons()
setupSearch()




