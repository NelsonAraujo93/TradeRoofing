'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceManager = Schema({
    mail: {type:String , unique:true },
    pass: String,
    providerId: String
});

module.exports = mongoose.model('ServiceManager', ServiceManager);