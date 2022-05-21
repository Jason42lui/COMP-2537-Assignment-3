function loadEvents(){
    $.ajax({
        // url: "https://infinite-river-98790.herokuapp.com/personalCart/allItems",
        url: "http://localhost:5000/personalCart/allItems",
        type: "get",
        success: (x)=>{
            console.log(x)
            for (i = 0; i < x.length ; i++) {
                $("main").append(`
                <div id="${x[i]["_id"]}"> 
                hello 
                </div>
                `)
            }
        }
    })
}


function setup() {
    loadEvents()
}

$(document).ready(setup)