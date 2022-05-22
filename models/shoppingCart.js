const mongoose = require("mongoose")
const Schema = mongoose.Schema

const shoppingCartSchema = new Schema (
    {
        owner: {type: Schema.Types.ObjectId, ref: "User"},
        pokemonID: Number,
        price: Number,
        quantitiy: Number,
        time: String,
    },
);

module.exports = mongoose.model("shoppingCart", shoppingCartSchema)