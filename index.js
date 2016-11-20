"use strict"

const Express = require("express"),
      { __express: Pug } = require("pug"),
      Promise = require("bluebird"),
      fetch = require("node-fetch"),
      app = Express(),
      { escape } = require("querystring"),
      { join } = require("path"),
      { apikey } = require("./config.json")
fetch.Promise = Promise

const gear = {
    "Warrior": "Plate",
    "Paladin": "Plate",
    "Hunter": "Mail",
    "Rogue": "Leather",
    "Priest": "Cloth",
    "Death Knight": "Plate",
    "Shaman": "Mail",
    "Mage": "Cloth",
    "Warlock": "Cloth",
    "Monk": "Leather",
    "Druid": "Leather",
    "Demon Hunter": "Leather"
}
const classes = [
    "Warrior",
    "Paladin",
    "Hunter",
    "Rogue",
    "Priest",
    "Death Knight",
    "Shaman",
    "Mage",
    "Warlock",
    "Monk",
    "Druid",
    "Demon Hunter"
]
const classFor = (i) => classes[i - 1]
const roleFor = (role) => {
    if (role === "DPS") {
        return role
    } else {
        return `${role.charAt(0)}${role.toLowerCase().slice(1)}`
    }
}
const gearFor = (i) => gear[classes[i - 1]]

const character = (player, character, realm) => ({ player, character, realm })
const characters = Promise.resolve([
    character("Jake", "Papabless", "Hellscream"),
    character("Jordan", "Gàladric", "Hellscream"),
    character("Robert", "Alkuriian", "Hellscream"),
    character("Billy", "Gnomemeansno", "Hellscream"),
    character("Andy", "Saldorky", "Hellscream"),
    character("Zach", "Dontchagnome", "Hellscream"),
    character("Justin", "Thrallbeard", "Darkspear"),
    character("Sarah", "Sairuh", "Hellscream"),
    character("Shawn", "Konichiwaa", "Aerie Peak"),
    character("Trevor", "Atromere", "Hellscream"),
    character("Chance", "Jununa", "Hellscream"),
])

app.use(Express.static(join(__dirname, "static")))
app.engine("pug", Pug)
app.set("view engine", "pug")
app.get("/", (_, res) => {
    characters.map(({ player, character, realm }) => {
        return fetch(`https://us.api.battle.net/wow/character/${realm}/${escape(character)}?fields=items&fields=talents&apikey=${apikey}`)
            .call("json")
            .then((character) => ({ player, character }))
    })
    .map(({ player, character }) => ({
        player,
        name: character.name,
        realm: character.realm,
        class: classFor(character.class),
        role: roleFor(character.talents[0].spec.role),
        gear: gearFor(character.class),
        ilvl: Number(character.items.averageItemLevelEquipped)
    }))
    .then((characters) => res.render("index", {
        characters,
        avg: Math.floor(characters.reduce((acc, { ilvl }) => acc + ilvl, 0) / characters.length)
    }))
})

app.listen(3000)