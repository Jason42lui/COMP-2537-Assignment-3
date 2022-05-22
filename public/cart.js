tax = 0.15
shipping = 20
function loadEvents(){
    TotalCost = 0
    $.ajax({
        // url: "https://infinite-river-98790.herokuapp.com/personalCart/allItems",
        url: "http://localhost:5000/personalCart/allItems",
        type: "get",
        success: (x)=>{
            console.log(x)
            for (i = 0; i < x.length ; i++) {
                $("main").append(`
                <div id="${x[i]["_id"]}"> 
                <h2> Pokemon Product: #${x[i].pokemonID} </h2>
                <h5> Time added to cart: ${x[i].time}</h5>
                <h4> Price: $${x[i].price} </h4>
                <h4> Quantity: ${x[i].quantitiy} </h4>
                <h4> Total cost: ${x[i].price * x[i].quantitiy}</h4>
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
                <h4> Subtotal: ${TotalCost} </h4>
                <h4> Tax: ${TotalCost * tax} </h4>
                <h4> Shipping: ${shipping} </h4>
                <h4> Order Total: ${(TotalCost) + (TotalCost * tax) + (shipping)}</h4>                
                </div>

                `)
            
        }
    })
}


function setup() {
    loadEvents()
    loadTotalCost()
}

$(document).ready(setup)