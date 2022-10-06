'use strict'
var express = require('express');
var api= express();
var validator = require('validator');
const axios = require('axios');
require('dotenv').config();
const { ObjectId } = require('mongodb');
// Agrega credenciales


var preferences = {}
preferences = {
    back_urls: {
        success: "https://localhost:3000/success-pay",
        failure: "https://localhost:3000/fail-pay",
        pending: "https://localhost:3000/pending-pay"
    },
    auto_return: "approved"
}

var paymentController = {
    /**
     * Funcion name:  createSale
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
    createSale:  async (req, res) => {
        var params = req.body;
        try {
            var validate_title = !validator.isEmpty(params.payment[0].title);
            var validate_unit_price = !validator.isEmpty(toString(params.payment[0].unit_price));
            var validate_quantity = !validator.isEmpty(toString(params.payment[0].quantity));
            /*var validate_referentCode = !validator.isEmpty(params.referentCode);
            var validate_identification = !validator.isEmpty(toString(params.identification));
            var validate_mail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
            var validate_phoneNumber = !validator.isEmpty(toString(params.phoneNumber));*/

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_title && validate_unit_price && validate_quantity) {
            let preference = {
                items: params.payment,
                notification_url:"https://hookb.in/G9B9RwLBK7SE2xPPN7XO",
                back_urls: {
                    success: "http://localhost:3000/success-pay",
                    failure: "http://localhost:3000/fail-pay",
                    pending: "http://localhost:3000/pending-pay"
                },
                auto_return: "approved"
              };
              
            

        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
     /**
     * Funcion name:  getSaleInfo
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
      getSalesInfo:  async (req, res) => {
        var params = req.params;
        console.log(params.id)
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
            /*var validate_referentCode = !validator.isEmpty(params.referentCode);
            var validate_identification = !validator.isEmpty(toString(params.identification));
            var validate_mail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
            var validate_phoneNumber = !validator.isEmpty(toString(params.phoneNumber));*/

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
           
        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },

};
module.exports = paymentController;