'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DocsSchema = Schema({
    url: String,
    type: String,
    date: Date,
    productId:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

module.exports = mongoose.model('Docs',DocsSchema);