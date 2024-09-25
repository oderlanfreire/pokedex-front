let offset = 0
const limit = 6
console.log(offset)


const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    ghost: '#705898',
    dark: '#000000', 
    fairy: '#EE99AC',
    bug: '#A8B820',
    rock: '#8B4513', 
    ground: '#E0C068',
    fighting: '#C03028',
    normal: '#A8A878',
    poison: '#A040B0',
    steel: '#B8B8D0',
    flying: '#A890F0',
}

async function getDataPokemon(offset, limit) {
    const resp =  await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
    const data = await resp.json()
    console.log(data.results)
    return data.results;
}


async function detailsPokemon(name) {
    const resp =  await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const data = await resp.json()
    console.log(data.name)
    return{
        name: data.name,
        img: data.sprites.front_default,
        types: data.types.map(typeInfo => typeInfo.type.name).join(', ')
    }
}

async function  loadPokemons() {
    const containerCard = document.getElementById('cardContainer')
    containerCard.innerHTML = ''
    const pokemons = await getDataPokemon(offset, limit)
    
    const detailsPromisses = pokemons.map(pokemon => detailsPokemon(pokemon.name))
    const detailsPokemons = await Promise.all(detailsPromisses)

    const pokeCards = detailsPokemons.map(details =>{

   
        
        const card = document.createElement('div')
        card.className = 'col-md-4'
        card.innerHTML = `
            <div class="card mb-4">
                <img src="${details.img}" class="card-img-top" alt="${details.name}">
                <div class="card-body">
                    <span class="card-title">${details.name.charAt(0).toUpperCase() + details.name.slice(1)}</span>
                    <p class="card-text">Type(s): ${details.types}</p>
                </div>
            </div>`
        return card
    }) 
    
    pokeCards.forEach((card, index) =>{
        const pokeType = detailsPokemons[index].types.split(', ')[0]

        card.addEventListener('mouseover', () => {
            document.body.style.backgroundColor = typeColors[pokeType] || '#f6bd20'
        })

        card.addEventListener('mouseout', () => {
            document.body.style.backgroundColor = ''
        })
        containerCard.append(card)
    })

    const backBt = document.getElementById('backBt')
    const nextBt = document.getElementById('nextBt')

    if (backBt && nextBt) {
        backBt.disabled = offset === 0
        nextBt.disabled = pokemons.length < limit
    } else {
        console.error('Botões não encontrados')
    }

}

document.getElementById('pokemonLogo').addEventListener('click', () =>{
    location.href = 'index.html'
})

document.getElementById('backBt').addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit;
        loadPokemons();
    }
})

document.getElementById('nextBt').addEventListener('click', () => {
    offset += limit;
    loadPokemons();
})

document.getElementById('buscar').addEventListener('click',async () =>{
    const pokeName = document.getElementById("pokemonName").value.toLowerCase()
    const backBt = document.getElementById('backBt')
    const nextBt = document.getElementById('nextBt')
    console.log(backBt.className)
    if (pokeName){
        pokeDetails = await getPokemon(pokeName)
        if (pokeDetails){
            showPokemon(pokeDetails)
            backBt.classList.add('d-none')
            nextBt.classList.add('d-none')
            console.log(backBt.className)

        }else{
            alert("Pokémon não encontrado.")
        }
    }else{
        clearScreen()
        backBt.classList.remove('d-none')
        nextBt.classList.remove('d-none')
        console.log(backBt.className)

    }

})

async function getPokemon(name) {
    try {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        if(!resp.ok){
            throw new Error('Pokémon não encontrado.')
        }
        const data = await resp.json()
        return {
            name: data.name,
            img: data.sprites.front_default,
            types: data.types.map(typeInfo => typeInfo.type.name).join(', ')
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

function showPokemon(data){
    const containerCard = document.getElementById('cardContainer')
    containerCard.innerHTML = ''

    const pokemonType = data.types.split(', ')[0]
    document.body.style.backgroundColor = typeColors[pokemonType] || '#FFFF00'

    const card = document.createElement('div')
    card.className = 'col-12'
    card.innerHTML = `
        <div class="card mb-4">
            <img src="${data.img}" class="card-img-top" alt="${data.name}">
            <div class="card-body">
                <span class="card-title">${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</span>
                <p class="card-text">Type(s): ${data.types}</p>
                <img src="../../public/pokeball.svg" alt="Favoritar" style="width: 24px; height: 24px;"class="clickable-image favoritos" data-name="${data.name}">
            </div>
        </div>`
    containerCard.append(card)

    const favPokemonSwitch = document.querySelector('.favoritos')
    favPokemonSwitch.addEventListener('click', (e) =>{
        const pokeName = e.target.getAttribute('data-name')
        toggleFav(pokeName)
    }) 

}
function clearScreen(){
    const containerCard = document.getElementById('cardContainer')
    containerCard.innerHTML = ''
}




document.getElementById('pokefavs').addEventListener('click', showFav)

function toggleFav(pokeName) {
    console.log(pokeName)
    let fav = JSON.parse(localStorage.getItem('pokemonsFavoritos')) || []
    console.log(fav)

    if(fav.includes(pokeName)){
        const removerPokemon = confirm(`Deseja remover ${pokeName} dos favoritos?`)
        if(removerPokemon){
            fav = fav.filter(name => name !== pokeName)
            alert(`${pokeName} removido dos favoritos.`)
        }
    } else {
        const addPokemon = confirm(`Deseja adicionar ${pokeName} aos favoritos?`);
        if (addPokemon) {
            fav.push(pokeName);
            alert(`${pokeName} adicionado aos favoritos.`);
        }
    }
    

    localStorage.setItem('pokemonsFavoritos', JSON.stringify(fav))
}

function showFav() {
    const backBt = document.getElementById('backBt')
    const nextBt = document.getElementById('nextBt')
    backBt.classList.add('d-none')
    nextBt.classList.add('d-none')

    const fav = JSON.parse(localStorage.getItem('pokemonsFavoritos')) || []
    const containerCard = document.getElementById('cardContainer')
    containerCard.innerHTML = ''

    const div = document.createElement('div')
    div.className = 'row'

    const favPromises = fav.map(async (name) => {
        const pokemon = await getPokemon(name)
        const card = document.createElement('div')
        card.className = 'col-md-6'
        card.innerHTML = `
            <div class="card mb-4">
                <img src="${pokemon.img}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <span class="card-title">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                    <p class="card-text">Type(s): ${pokemon.types}</p>
                    <img src="../../public/pokeball.svg" alt="Favoritar" style="width: 24px; height: 24px;" class="clickable-image favoritos" data-name="${pokemon.name}">
                </div>
            </div>`

        const selectCard = card.querySelector('.card');
        const pokeType = pokemon.types.split(', ')[0]

        selectCard.addEventListener('mouseover', () => {
            document.body.style.backgroundColor = typeColors[pokeType] || '#f6bd20'
        })

        selectCard.addEventListener('mouseout', () => {
            document.body.style.backgroundColor = ''
        })

        return card
    })

    Promise.all(favPromises).then(cards => {
        cards.forEach(card => div.append(card))
        containerCard.append(div)
    })

    const favPokemonSwitch = document.querySelectorAll('.favoritos')
    favPokemonSwitch.forEach(favPokemon => {
        favPokemon.addEventListener('click', (e) => {
            const pokeName = e.target.getAttribute('data-name')
            toggleFav(pokeName)
        })
    })
}

loadPokemons()
