to_add = ' '

function processPokeResp(data) {
    to_add += `
    <div class="img_container">
    <h3>${data.name}</h3>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </a>
    </div>`
}

async function loadNineImages() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) {
            to_add += `<div class="images_groups">`
        }

        x = Math.floor(Math.random() * 151) + 1


        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${x}/`,
            success: processPokeResp
        })


        if (i % 3 == 0) { //only when i = 3, 6, 9
            to_add += `</div>`
        }
    }
    $("main").html(to_add)
}

function setup() {
    loadNineImages();
}


$(document).ready(setup)