'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    mail: {type:String , unique:true, require:true },
    pass: {type:String , require:true },
    phoneNumber: Number,
    manager: {type:Boolean, require:true},
    superManager: {type:Boolean, require:true},
    active: {type:Boolean, require:true},
    id:String,
    managerId:String

});

module.exports = mongoose.model('User', UserSchema);