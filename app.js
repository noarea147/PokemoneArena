/*  func-names: "off" */
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
app.use(express.json());
app.use(cors());
const data = fs.readFileSync("./data/pokedex.json");

const isWinner = (types, weaknesses) => {
  let res = false;
  types.map((type) => {
    res = weaknesses.includes(type);
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
        <p> Element Type : ${singlePokemon.type.map((one) => {
          return "<li>" + one + "</li>";
        }).join("")}</p>
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
  let html = `${pokemon
    .map((singlePokemon) => {
      if (singlePokemon.weaknesses.includes(typeName)) {
        return (
          "<li>" + singlePokemon.name + "is weak against " + typeName + "</li>"
        );
      }
    })
    .join("")}`;
  res.send(html);
});
//returns all pokemons that are strong  to those element type
app.get("/strong/:typeName", (req, res) => {
  const typeName = req.params.typeName;
  const pokemon = JSON.parse(data).pokemon;
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
    .join("")}`;
  res.send(html);
});
// arena API for the battle returns win / draw / lose based on the pokemon type
app.post("/fight", (req, res) => {
  const pokemon = JSON.parse(data).pokemon;
  const { myPokemon, enemyPokemon } = req.body;
  let myWeaknesses = [];
  let myType = [];
  let enemyWeaknesses = [];
  let enemyType = [];
  pokemon.map((singlePokemon) => {
    if (singlePokemon.name === myPokemon) {
      myWeaknesses = singlePokemon.weaknesses;
      myType = singlePokemon.type;
    } else if (singlePokemon.name === enemyPokemon) {
      enemyWeaknesses = singlePokemon.weaknesses;
      enemyType = singlePokemon.type;
    }
  });

  let myResult = isWinner(myType, enemyWeaknesses);
  let enemyResult = isWinner(enemyType, myWeaknesses);
  if (myResult && enemyResult) {
    res.send({ message: "Draw", stausCode: 200 });
  } else if (myResult && !enemyResult) {
    res.send({ message: "You win", stausCode: 200 });
  } else if (!myResult && enemyResult) {
    res.send({ message: "You lose", stausCode: 200 });
  }
});

module.exports = app;
