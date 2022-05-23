type_g = " "
abilities_g = " "
name_g = ' '
to_add = " "
function processPokemonResp(data) {
    for (i = 0; i < data.types.length; i++)
        if (data.types[i].type.name == type_g) {
            $("main").append(`
            <div class="pokemonBox">
                <div>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png">
                </div>
                <div class="pokemonInfo">
                    <h1> ID: ${data.id} </h1> 
                    <h1> Name: ${data.name} </h1>
                    <p> Type: ${data.types[0].type.name} </p>
                    <p> Height: ${data.height} dm </p>
                    <p> Weight: ${data.weight} hg </p>
                </div>
            </div> 
            `)
        }
}

function processPokemonResp_abilities(data) {
     for (i = 0; i < data.abilities.length; i++)
        if (data.abilities[i].ability.name == abilities_g) {
            $("main").append(`
        <div class="pokemonBox">
            <div>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png">
            </div>
            <div class="pokemonInfo">
                <h1> ID: ${data.id} </h1> 
                <h1> Name: ${data.name} </h1>
                <p> Type: ${data.types[0].type.name} </p>
                <p> Height: ${data.height} dm </p>
                <p> Weight: ${data.weight} hg </p>
            </div>
        </div> 
        `)
        }

}

function display_type(type_) {
    $("main").empty()
    type_g = type_
    $("#history").append(`
    <div class="history_result">Pokemon's Type: ${type_g}</a><button id="delete_pokemon">X</button></div>`)
    for (i = 1; i < 151; i++) {
        $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokemonResp
        })
    }
    $("#history_content").append($(`<div id="history_result_${type_}">Pokemon's Type: ${type_}<button class="delete_pokemon_type">X</button></div>`))

}

function display_abilities(abilities_) {
    $("main").empty()
    abilities_g = abilities_
    $("#history").append(`
    <div class="history_result">Pokemon's Ability: ${abilities_g}</a><button id="delete_pokemon">X</button></div>`)
    for (i = 1; i < 151; i++) {
        $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokemonResp_abilities
        })
    }
    $("#history_content").append($(`<div id="history_result_${abilities_}"><a href="javascript:processPokemonResp_abilities(https://infinite-river-98790.herokuapp.com/api/v2/pokemon/type/${i})">Pokemon's ability: ${abilities_}</a><button class="delete_pokemon_ability">X</button></div>`))

}

function display_name() {
    $("main").empty()
    pokeName = document.getElementById("pokemon_name").value

    $.ajax(
        {
            "url": `https://pokeapi.co/api/v2/pokemon/${pokeName}`,
            "type": "GET",
            "success": function (data) {
                if (pokeName == Number(pokeName)) {
                    alert("Pokemon names are only accepted")
                } else {
                    $("main").append(`
                    <div class="pokemonBox">
                        <div>
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png">
                        </div>
                        <div class="pokemonInfo">
                            <h1> ID: ${data.id} </h1> 
                            <h1> Name: ${data.name} </h1>
                            <p> Type: ${data.types[0].type.name} </p>
                            <p> Height: ${data.height} dm </p>
                            <p> Weight: ${data.weight} hg </p>
                        </div>
                    </div> 
                    `)
                    $("#history").append(`
                    <div class="history_result"><a href="/profile/${data.id}">Pokemon's Name ${data.name}</a><button id="delete_pokemon">X</button></div>
                    `)
                }
            }
        },
    )
}
function clear() {
    $("#history_content").empty()
}

function delete_pokemon_type() {
    const nameDiv = document.getElementById(`history_result_${type_g}`)
    const parent = nameDiv.parentNode;
    parent.removeChild(nameDiv)
}

function delete_pokemon_ability() {
    const nameDiv = document.getElementById(`history_result_${abilities_g}`)
    const parent = nameDiv.parentNode;
    parent.removeChild(nameDiv)
}

var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function insertSearchEventTOTheTimeLineType(poke_type) {
    $.ajax({
        url: "https://infinite-river-98790.herokuapp.com/timeline/input",
        type: "put",
        data: {
            text: `Client has searched for Pokemon type: ${poke_type}`,
            time: `${now}`,
            hits: 1
        },
        success: function (r) {
            console.log(r)
        }
    })
}

function insertSearchEventTOTheTimeLineAbilities(poke_abilities) {
    $.ajax({
        url: "https://infinite-river-98790.herokuapp.com/timeline/input",
        type: "put",
        data: {
            text: `Client has searched for Pokemon ability: ${poke_abilities}`,
            time: `${now}`,
            hits: 1
        },
        success: function (r) {
            console.log(r)
        }
    })
}

function insertSearchEventTOTheTimeLineName() {
    pokeName = document.getElementById("pokemon_name").value
    $.ajax({
        url: "https://infinite-river-98790.herokuapp.com/timeline/input",
        type: "put",
        data: {
            text: `Client has searched for Pokemon name: ${pokeName}`,
            time: `${now}`,
            hits: 1
        },
        success: function (r) {
            console.log(r)
        }
    })
}

function setup() {
    display_type($("#poke_type option:selected").val())
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display_type($("#poke_type option:selected").val())

        insertSearchEventTOTheTimeLineType(poke_type)
    })
    display_abilities($("#poke_abilities option:selected").val())
    $("#poke_abilities").change(() => {
        poke_abilities = $("#poke_abilities option:selected").val();
        display_abilities($("#poke_abilities option:selected").val())

        insertSearchEventTOTheTimeLineAbilities(poke_abilities)
    })

    $("#find_pokemon").click(display_name);
    $("#find_pokemon").click(insertSearchEventTOTheTimeLineName);
    $(".delete_pokemon_type").click(delete_pokemon_type);
    $(".delete_pokemon_ability").click(delete_pokemon_ability);
    $("#history_content").on("click", "button", function () {
        const nameDiv = document.getElementById(`history_result_${name_g}`)
        const parent = nameDiv.parentNode;
        parent.removeChild(nameDiv)
    });
    $("#clear_pokemon").click(clear);
}



$(document).ready(setup)