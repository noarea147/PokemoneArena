/*  func-names: "off" */
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
app.use(express.json());
app.use(cors());
const data = fs.readFileSync("./data/pokedex.json");


//helper functions
const removeDuplicates = (arr) => {
  return arr
    .filter((item, index) => {
      return arr.indexOf(item) === index;
    })
    .sort();
};
const getAllTypes = (pokemons) => {
  let res = [];
  pokemons.map((pokemons) => {
    res = [...res, ...pokemons.type];
  });
  return removeDuplicates(res);
};
const isWinner = (types, weaknesses) => {
  let res = false;
  types.map((type) => {
    res = weaknesses.includes(type);
  });
  return res;
};

const getPokemonTypes = (name) => {
  const pokemons = JSON.parse(data).pokemon;
  let res = [];
  pokemons?.map((pokemon) => {
    if (pokemon.name === name) {
      pokemon.type.map((type) => {
        res.push(type);
      });
    }
  });
  return res;
};

const getPokemonWeakness = (name) => {
  const pokemons = JSON.parse(data).pokemon;
  let res = [];

  pokemons?.map((pokemon) => {
    if (pokemon.name === name) {
      pokemon.weaknesses.map((weakness) => {
        res.push(weakness);
      });
    }
  });
  return res;
};



//returns list of pokemon names
app.get("/", (req, res) => {
  const pokemon = JSON.parse(data).pokemon;
  let html = `${pokemon
    .map((singlePokemon) => {
      return "<li>" + singlePokemon.name + "</li>";
    })
    .join("")}`;
  res.send(html);
});


//returns list of pokemon types
app.get("/alltypes", (req, res) => {
  const pokemon = JSON.parse(data).pokemon;
  let alltypes = getAllTypes(pokemon);
  let html = `${alltypes
    .map((type) => {
      return "<li>" + type + "</li>";
    })
    .join("")}`;
  res.send(html);
});



//returns list of pokemon details
app.get("/:pokemonName", (req, res) => {
  const pokemonName = req.params.pokemonName;
  const pokemon = JSON.parse(data).pokemon;
  let found = pokemon
    .map((singlePokemon) => {
      if (singlePokemon.name === pokemonName) {
        return `<h1>${singlePokemon.name}</h1>
        <img src="${singlePokemon.img}" alt="${singlePokemon.name}">
        <p> spawn chance : ${singlePokemon.spawn_chance}</p>
        <p> Element Type : ${singlePokemon.type
          .map((one) => {
            return "<li>" + one + "</li>";
          })
          .join("")}</p>
        `;
      }
    })
    .join("");

  found ? res.send(found) : res.send("<h1>Pokemon not found</h1>");
});


//returns all pokemons that are weak to those element type
app.get("/weak/:typeName", (req, res) => {
  const typeName = req.params.typeName;
  const pokemon = JSON.parse(data).pokemon;
  let isValidType = getAllTypes(pokemon).includes(typeName);

  let html = `${pokemon
    .map((singlePokemon) => {
      if (singlePokemon.weaknesses.includes(typeName)) {
        return (
          "<li>" + singlePokemon.name + "is weak against " + typeName + "</li>"
        );
      }
    })
    .join("")}`;
  isValidType ? res.send(html) : res.send("<h1>Invalid type</h1>");
});


//returns all pokemons that are strong  to those element type
app.get("/strong/:typeName", (req, res) => {
  const typeName = req.params.typeName;
  const pokemon = JSON.parse(data).pokemon;
  let isValidType = getAllTypes(pokemon).includes(typeName);
  let html = `${pokemon
    .map((singlePokemon) => {
      if (!singlePokemon.weaknesses.includes(typeName)) {
        return (
          "<li>" +
          singlePokemon.name +
          " is strong against " +
          typeName +
          "</li>"
        );
      }
    })
    //join() to remove unexpected comma from map function
    .join("")}`;
  isValidType ? res.send(html) : res.send("<h1>Invalid type</h1>");
});
// arena API for the battle returns win / draw / lose based on the pokemon type
app.post("/fight", async (req, res) => {
  const { myPokemon, enemyPokemon } = req.body;
  let myWeaknesses = getPokemonWeakness(myPokemon);
  let myType = getPokemonTypes(myPokemon);
  let enemyWeaknesses = getPokemonWeakness(enemyPokemon);
  let enemyType = getPokemonTypes(enemyPokemon);

  let myResult = isWinner(myType, enemyWeaknesses);
  let enemyResult = isWinner(enemyType, myWeaknesses);
  if ((myResult && enemyResult) || (!myResult && !enemyResult)) {
    res.send({ message: "Draw", stausCode: 200 });
  } else if (myResult && !enemyResult) {
    res.send({ message: "You win", stausCode: 200 });
  } else if (!myResult && enemyResult) {
    res.send({ message: "You lose", stausCode: 200 });
  }
});

module.exports = app;
