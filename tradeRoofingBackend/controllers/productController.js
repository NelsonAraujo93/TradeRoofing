'use strict'
var referralCodeGenerator = require ('referral-code-generator');
var validator = require('validator');
var esaUserSchema = require('../models/esaUser');
var refCodeSchema = require('../models/refCode');
var createRef= require('./createRef');
var bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
require('dotenv').config();

//const configMensaje = require('../controllers/configMensajes');

var esaController = {
    /**
     * Funcion name:  createProduct
     * Funcionalidad: Guarda un producto de un comerciante en la base de datos
     * 
     */
     createProduct:  async (req, res) => {
        var params = req.body;
        //Guardar las imagenes
        
        //Crear array de objetos de imagenes

        //Validar data
        var refObject= await createRef.createRefCode();
        console.log(refObject._id);
        var cryptedPass = await bcrypt.hashSync(params.pass, 8);
        //Crear RefCode
        //Crear Docs
        //Validar Requeridos
        
        //CrearUSuario
        
        try {
            var validate_fullName = !validator.isEmpty(params.fullName);
            var validate_departamento = !validator.isEmpty(params.departamento);
            var validate_ciudad = !validator.isEmpty(params.ciudad);
            var validate_referentCode = !validator.isEmpty(params.referentCode);
            var validate_identification = !validator.isEmpty(toString(params.identification));
            var validate_mail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
            var validate_phoneNumber = !validator.isEmpty(toString(params.phoneNumber));

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_fullName && validate_pass && validate_mail && validate_phoneNumber && validate_departamento && validate_ciudad && validate_referentCode && validate_identification) {

            //crear objeto
            var esaUser = new esaUserSchema();

            esaUser.fullName = params.fullName;
            esaUser.departamento = params.departamento;
            esaUser.ciudad = params.ciudad;
            esaUser.referentCode = params.referentCode;
            esaUser.identification = params.identification;
            esaUser.pass = cryptedPass;
            esaUser.mail = params.mail;
            esaUser.phoneNumber = params.phoneNumber;
            esaUser.estado = false;
            esaUser.refCode= refObject._id;

            //guardar en base de datos con save

            esaUser.save((err, esaUSerStored) => {

                if (err || !esaUSerStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        status: 'ok',
                        data: esaUSerStored
                    });
                }
            })

        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
     /**
     * Funcion name:  createBussiness
     * Funcionalidad: Guarda un usuario bussiness en la base de datos
     * 
     */
      createBussiness:  async (req, res) => {
        var params = req.body;
        
        var refObject= await createRef.createRefCode();
        console.log(refObject);
        console.log('2');
            
        //Crear RefCode
        //Validar Referente
        //Crear Docs
        //Validar Requeridos
        
        //CrearUSuario
        
        try {
            var validate_userName = !validator.isEmpty(params.user_name);
            var validate_email = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
            var validate_phoneNumber = !validator.isEmpty(toString(params.phone_number));
            var validate_lastName = !validator.isEmpty(params.last_name);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_userName && validate_pass && validate_email && validate_phoneNumber && validate_lastName) {

            //crear objeto
            var barberShop = new barberShopModel();

            barberShop.name = params.user_name;
            barberShop.pass = params.pass;
            barberShop.mail = params.mail;
            barberShop.lastName = params.last_name;
            barberShop.phoneNumber = params.phone_number;


            //guardar en base de datos con save

            barberShop.save((err, barberShopStored) => {

                if (err || !barberShopStored) {
                    return res.status(500).send({
                        status: 'registered',
                        message: 'el articulo no se ha guardado, el correo debe ser unico'
                    });
                } else {
                    return res.status(200).send({
                        status: 'ok',
                        data: barberShop
                    });
                }
            })

        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
    /**
     * Funcion name:  login
     * Funcionalidad: logind e barberos
     * 
     */
    login: (req, res) => {
        var params = req.body;
        console.log(params);
        var userMail = params.mail;
        var pass = params.pass;
        try {
            var validate_userMail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);

        } catch (err) {
            return res.status(400).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

        if (validate_userMail && validate_pass) {
            //bcrypt
            esaUserSchema.findOne({ 'mail': userMail}).exec((err, user) => {
                if (err && !user || user.length == 0) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    if(bcrypt.compareSync(params.pass, user.pass)){
                        var id = user._id;
                        let token = jwt.sign({id}, process.env.JWT_SECRET,{
                            expiresIn:  process.env.JWT_EXPIRES_IN
                        });
                        var cookieOptions = {
                            expires: new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            httpOnly:true
                        };
    
                        return res.status(200).send({
                            status: 'Ok',
                            data: user,
                            token: token,
                            expire: cookieOptions.expires 
                        });
                    }else{
                        return res.status(401).send({
                            status: 'error',
                            message: 'contraseña incorrecta',
                        });
                    }
                }
            });
            
        } else {
            return res.status(400).send({
                status: 'error',
                mesage: 'Formulario mal digilenciado'
            });
        }
    },
    /**
     * Funcion name:  auth
     * Funcionalidad: permite iniciar sesion y crea un token
     * 
     */
     auth:  async (req, res) => {
        var token = req.headers["x-acces-token"];
        if (!token) {
            return res.status(404).send({
                status: 'error',
                message: 'PorFavor inicia sesion'
            });
        } else {
           jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
               if(err){
                    return res.status(404).send({
                        status: 'error',
                        message: err
                    });
               }else{
                    return res.status(200).send({
                        status: 'Ok',
                        message: 'usuario autenticado',
                        data: decoded
                    });
               }
           })
        }
    },
    /**
     * Funcion name:  createRefCode
     * Funcionalidad: createRefCode d e barberos
     * 
     */
    createRefCode: async (req, res) => {
        var codeGenerated= referralCodeGenerator.alphaNumeric('uppercase', 8, 7)
        console.log(codeGenerated);
      

        //crear objeto
        var refCode = new refCodeSchema();

        refCode.code = codeGenerated;
        refCode.creationDate = new Date();
        refCode.state = true;


        //guardar en base de datos con save

        refCode.save((err, refCodeStored) => {

            if (err || !refCodeStored) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error al crear el código de referencia'
                });
            } else {
                return refCodeStored
            }
        })
    },
    /**
     * Funcion name:  getUser
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
    getUser: (req, res) => {
        var params = req.params;
        try {
            var validate_id = !validator.isEmpty(params.id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos imcompletos'
            });
        }

        if (validate_id) {
            //verificar que exista
            esaUserSchema.findById(params.id, (err, user) => {
                if (err && !user) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: user
                    });
                }
            });
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos incompletos'
            });
        }
    },

    /*formularioCorreo: (req, res) => {
        configMensaje(req.body);
        console.log(res);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },*/


};
module.exports = esaController;