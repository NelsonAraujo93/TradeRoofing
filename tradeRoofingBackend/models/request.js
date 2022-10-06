'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = Schema({
    requestType: String,
    creationDate: Date,
    finishedDate: Date,//selector de ciudades
    serviceId: String,
    document: String,
    userId:String,
    projectId:String,
    ownerName:String,
    address:String,
    note:String
});

module.exports = mongoose.model('Request', RequestSchema);