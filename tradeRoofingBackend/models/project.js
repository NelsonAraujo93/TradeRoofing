'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProjectSchema = Schema({
    name: {
        type: String,
        required: true
    },
    access: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    note: String,
    date: Date,
    address: {
        type: String,
        required: true
    },
    contact: String,
    contact_number: Number,
    userId: {
        type: String,
        required: true
    },
    id:String,
    deleted:Boolean
});

module.exports = mongoose.model('Project', ProjectSchema);