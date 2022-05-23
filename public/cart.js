tax = 0.15
shipping = 20
TotalCost = 0
totalProduct = 0
function loadEvents(){
    $.ajax({
        // url: "https://infinite-river-98790.herokuapp.com/personalCart/allItems",
        url: "http://localhost:5000/personalCart/allItems",
        type: "get",
        success: (x)=>{
            console.log(x)
            for (i = 0; i < x.length ; i++) {
                totalProduct += 1
                console.log(totalProduct)
                $("main").append(`
                <div class="orderContent"> 
                <div id="${x[i]["_id"]}"> 
                <h2> Pokemon Product: #${x[i].pokemonID} </h2>
                <h5> Time added to cart: ${x[i].time}</h5>
                <h4> Price: $${x[i].price} </h4>
                <h4> <button class="minusButton" id="${x[i]["_id"]}" ><</button> Quantity: ${x[i].quantitiy} <button class="addButton" id="${x[i]["_id"]}" >></button></h4>
                <h4> Total cost: $${x[i].price * x[i].quantitiy} </h4>
                </div>
                <div class"removeContainer">
                <button class="removeButton" id="${x[i]["_id"]}">  X </button>
                </div>
                </div>
                `)
                TotalCost += parseInt(`${x[i].price * x[i].quantitiy}`)
            }
        }
    })
}

function loadTotalCost(){
    $.ajax({
        // url: "https://infinite-river-98790.herokuapp.com/personalCart/allItems",
        url: "http://localhost:5000/personalCart/allItems",
        type: "get",
        success: (x)=>{
            console.log(x)
                $("#totalContainer").append(`
                <div class="calculationContainer">
                <h3> Subtotal: $${TotalCost} </h3>
                <h3> Tax: $${TotalCost * tax} </h3>
                <h3> Shipping: $${shipping} </h3>
                <h2> Order Total: $${(TotalCost) + (TotalCost * tax) + (shipping)}</h2>
                <button class="orderButton">Place order</button>                
                </div>

                `)
            
        }
    })
}

function increamentHitsByOne() {
    console.log("hello1")
    x = this.id
    console.log(this.id)
    $.ajax({
        // url: `https://infinite-river-98790.herokuapp.com/timeline/increaseHits/${x}`,
        url: `http://localhost:5000/personalCart/increaseQuantity/${x}`,
        type: "get",
        success: function() {   
            location.reload();  
        }
    })
}

function reductionHitsByOne() {
    console.log("hello2")
    x = this.id
    console.log(this.id)
    $.ajax({
        // url: `https://infinite-river-98790.herokuapp.com/timeline/increaseHits/${x}`,
        url: `http://localhost:5000/personalCart/decreaseQuantity/${x}`,
        type: "get",
        success: function() {   
            location.reload();  
        }
    })
}

function deleteOrder() {
    x = this.id
    $.ajax({
        // url: `https://infinite-river-98790.herokuapp.com/timeline/remove/${x}`,
        url: `http://localhost:5000/personalCart/remove/${x}`,
        type: "get",
        success: function() {   
            location.reload();  
        }
    })
}

var now = new Date(Date.now());
var formatted =
  now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function proceedPokemonOrder() {
  $.ajax({
    // url: "https://infinite-river-98790.herokuapp.com/personalCart/insert",
    url: "http://localhost:5000/oldOrder/insert",
    type: "put",
    data: {
      Items: totalProduct,
      totalCost: ((TotalCost) + (TotalCost * tax) + (shipping)),
      time: `${now}`,
    },
    success: function (r) {
      console.log(r);
    },
  });
}

function removePokemonOrder() {
    $.ajax({
      // url: "https://infinite-river-98790.herokuapp.com/personalCart/insert",
      url: "http://localhost:5000/personalCart/remove",
      type: "get",
      success: function (r) {
        location.reload();  
      },
    });
  }



function setup() {
    loadEvents()
    loadTotalCost()

    $("body").on("click", ".addButton", increamentHitsByOne)
    $("body").on("click", ".minusButton", reductionHitsByOne)
    $("body").on("click", ".removeButton", deleteOrder)
    $("body").on("click", ".orderButton", proceedPokemonOrder)
    $("body").on("click", ".orderButton", removePokemonOrder)
}

$(document).ready(setup)