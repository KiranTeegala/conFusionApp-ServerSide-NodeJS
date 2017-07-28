// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create a schema
var promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    },
    label: {
        type: String,
        default:""
    },
    price:{
        price: { type: Currency }
    },
    description: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var promos = mongoose.model('promos', promoSchema);

// make this available to our Node applications
module.exports = promos;