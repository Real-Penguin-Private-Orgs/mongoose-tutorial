const { Schema, model } = require("mongoose");

const icecreamSchema = new Schema({
    flavour: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    }
})

module.exports = model('Icecream', icecreamSchema)