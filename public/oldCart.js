orderNumber = 0
function loadEvents() {
  $.ajax({
    // url: "https://infinite-river-98790.herokuapp.com/timeline/getAllEvents",
    url: "https://infinite-river-98790.herokuapp.com/oldOrder/allItems",
    type: "get",
    success: (x) => {
      console.log(x);
      for (i = 0; i < x.length; i++) {
          orderNumber += 1
        $("main").append(`
                    <div id="${x[i]["_id"]}">
                    <h2> Order number: # ${orderNumber}</h2>
                    <span>Order placed: </span>${x[i].time}
                    <br>
                    <p><span>Number of products:</span> ${x[i].Items}</p>
                    <p><span>Total Cost:</span> $${x[i].totalCost}</p>
                    </div>
                  `);
      }
    },
  });
}

function setup() {
  loadEvents();
  $("#buy_pokemon").click(() => {
    //   console.log("Hello");
    poke_quantities = $("#poke_quantity").val();
    insertPokemonCart(poke_quantities);
  });
}

$(document).ready(setup);
