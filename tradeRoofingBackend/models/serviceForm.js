'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceFormSchema = Schema({
    startingDate: Date,
    creationDate: Date,
    finishedDate: Date,
    userId: String,
    projectId: String,//selector de ciudades
    status: String,
    note: String,
    serviceType:String,
    chat: [{ 
        type: Object
    }],
    deleted:Boolean,
    companyCams:String,
    invoiceUrl:String,
    imageReportUrl:String
});

module.exports = mongoose.model('ServiceForm', ServiceFormSchema);