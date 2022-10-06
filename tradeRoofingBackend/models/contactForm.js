'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactFSchema = Schema({
    date: Date,
    name: String,
    mail: String,
    phone: Number,
    comment: String,
});

module.exports = mongoose.model('ContactF', ContactFSchema);