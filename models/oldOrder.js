const mongoose = require("mongoose")
const Schema = mongoose.Schema

const oldCartSchema = new Schema (
    {
        owner: {type: Schema.Types.ObjectId, ref: "User"},
        Items: Number,
        totalCost: Number,
        time: String,
    },
);

module.exports = mongoose.model("oldCart", oldCartSchema)