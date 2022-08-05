# You need to copy paste the next line into .env file in the root of the project
# or the server gonna run or 3000 by default
PORT_CLIENT=8000
# You need to run npm install
# then run the server with node server.js  or nodemon server.js  

# PokemoneArena

[GET] /  -> returns list of pokemon names
[GET] /?pokemonName -> returns image, element type, spawn chance
[GET] /weak/?typeName -> returns all pokemons that are weak to those element type
[GET] /strong/?typeName -> returns all pokemons that are strong to those element type
[POST] /fight/ BODY:{myPokemon:string, enemyPokemon:string} -> returns win / draw / lose 

