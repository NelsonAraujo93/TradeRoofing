'use strict'

var validator = require('validator');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
var userSchema = require('../models/user');
var projectSchema = require('../models/project');
var bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const mailer = require('./mailer');
const { param } = require('../routes/route');



var usersController = {
      /**
     * Funcion name:  activateUser
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
       activateUser:  async (req, res) => {
        var params = req.body;
        console.log(params);
        if (params.userId) {
            //crear objeto
            let userUpdated= await userSchema.findOneAndUpdate({_id:ObjectId(params.userId)},{active: true});
            //guardar en base de datos con save
            if(userUpdated){
                return res.status(200).send({
                    status: 'ok',
                    data: userUpdated
                });
            }else{
                return res.status(500).send({
                    status: 'error',
                    message: 'Something went wrong updating'
                });
            }
          
        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
      /**
     * Funcion name:  createManager
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
       createManager:  async (req, res) => {
        var params = req.body;
        var cryptedPass = await bcrypt.hashSync(params.pass, 8);
        try {
            var validate_mail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_pass && validate_mail) {

            //crear objeto
            var user = new userSchema();
            user.pass = cryptedPass;
            user.mail = params.mail;
            user.name=params.name;
            user.active = true;
            user.manager = params.manager?true:false;
            user.superManager = params.superManager?true:false;
            //guardar en base de datos con save

            user.save(async (err, userStored) => {
                if (err || !userStored) {

                    return res.status(200).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: userStored
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
     * Funcion name:  createUserFirstStep
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
       createUserFirstStep:  async (req, res) => {
        var params = req.body;
        var cryptedPass = await bcrypt.hashSync(params.pass, 8);
        //Crear RefCode
        //Crear Docs
        //Validar Requeridos
        
        //CrearUSuario
        console.log(params);
        try {
            var validate_mail = !validator.isEmpty(params.mail);
            var validate_pass = !validator.isEmpty(params.pass);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_pass && validate_mail) {

            //crear objeto
            var user = new userSchema();
            user.pass = cryptedPass;
            user.mail = params.mail;
            user.active = false;
            user.manager = false;
            user.superManager = false;
            //guardar en base de datos con save

            user.save(async (err, userStored) => {
                if (err || !userStored) {

                    return res.status(200).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    const mailForm=params;
                    mailForm.url='http://192.168.1.200:3000/activate/'+userStored._id;
                    mailForm.mailState=0;
                    
                    mailer(params);
                    return res.status(200).send({
                        status: 'Ok',
                        data: userStored
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
     * Funcion name:  createUserSecondStep
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
     createUserSecondStep:  async (req, res) => {
        var params = req.body;
        //Crear RefCode
        //Crear Docs
        //Validar Requeridos
        
        //CrearUSuario
        
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_city = !validator.isEmpty(params.city);
            var validate_address = !validator.isEmpty(params.address);
            var validate_state = !validator.isEmpty(toString(params.state));
            var validate_phoneNumber = !validator.isEmpty(toString(params.phoneNumber));

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_name  && validate_phoneNumber  && validate_city && validate_address && validate_state) {

            //crear objeto
            const filter = { _id: ObjectId(params._id)};
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
              $set: {
                name: params.name,
                phoneNumber: params.phoneNumber,
                city: params.city,
                address: params.address,
                state: params.state,
                id:params._id
              },
            };
            let updateUser=await userSchema.findOneAndUpdate(filter,updateDoc,options)

            console.log(updateUser);
            if(!updateUser){
                return res.status(500).send({
                    status: 'error',
                    message: err
                });
            } else {
                return res.status(200).send({
                    status: 'ok',
                    data: updateUser
                });
            }

        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
    /**
     * Funcion name:  createProject
     * Funcionalidad: Guarda un proyecto comerciante en la base de datos
     * 
     */
    createProject:  async (req, res) => {
        var params = req.body;

        //guardar imagenes
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_user = !validator.isEmpty(params.user);
            var validate_address = !validator.isEmpty(params.address);
            var validate_type = !validator.isEmpty(params.type);
            var validate_access = !validator.isEmpty(params.access);
    
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos' + err
            });
        }
        
        if ( validate_name  && validate_access && validate_address && validate_type && validate_user) {
        
            //crear objeto
        
            
            //guardar en base de datos con save
            userSchema.findOne(
                {_id:params.user}, 
                async (err, userUpdated) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'el articulo no se ha actualizado' + err
                        });
                    }
                    if(!userUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'el proveedor no existe'
                        });
                    }else{
                        var project = new projectSchema();
                        project.name = params.name;
                        project.date = new Date();
                        project.address = params.address;
                        project.contact = params.contact;
                        project.contact_number = params.contact_number;
                        project.type= params.type;
                        project.access = params.access;
                        project.note = params.note;
                        project.userId = userUpdated._id;
                        project.save(async (err, projectStored) => {
                            if (err || !projectStored) {
                                return res.status(500).send({
                                    status: 'error',
                                    message: err
                                });
                            }else{

                                console.log(projectStored);
                                const id=projectStored._id;
                                const strId=id.toString();
                                let updateProjec= await projectSchema.findOneAndUpdate({_id:ObjectId(strId)},{id:strId});
                                console.log(updateProjec);

                                return res.status(200).send({
                                    status: 'OK',
                                    message: 'el proyecto se ha creado',
                                    data: projectStored
                                }); 
                            }
                        })
                    }
                }
            );
        } else {
    
            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
    
     /**
     * Funcion name:  deleteProduct
     * Funcionalidad: Borra un producto comerciante en la base de datos
     * 
     */
    deleteProduct:  async (req, res) => {
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            esaProductSchema.findOneAndDelete({_id:ObjectId(params.id)},(err, deletedProduct) => {
                //hacer update en proveedor
                if (err || !deletedProduct) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        status: 'ok',
                        data: deletedProduct
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
     * Funcion name:  upDateProject
     * Funcionalidad: actualiza un proyecto comerciante en la base de datos
     * 
     */
    upDateProject:  async (req, res) => {
        var params = req.body;
        //guardar imagenes
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_address = !validator.isEmpty(params.address);
            var validate_type = !validator.isEmpty(params.type);
            var validate_access = !validator.isEmpty(params.access);
    
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos' + err
            });
        }
        if ( validate_name  && validate_access && validate_address && validate_type) {
            projectSchema.findById({_id:ObjectId(params.id)},(err, updateProject) => {
                updateProject.name = params.name;
                updateProject.address = params.address;
                updateProject.contact = params.contact;
                updateProject.contact_number = params.contact_number;
                updateProject.type= params.type;
                updateProject.access = params.access;
                updateProject.note = params.note;
                updateProject.save((err, projectStored) => {
                    if (err || !projectStored) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    } 
                    return res.status(200).send({
                        status: 'OK',
                        message: 'el proyecto se ha actualizado',
                        data: projectStored
                    }); 
                });
            })
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos' + err
            });
        }

    },
  /**
     * Funcion name:  upDateProductStock
     * Funcionalidad: axtualiza un producto comerciante en la base de datos
     * 
     */
   upDateProductStock:  async (req, res) => {
    var params = req.body;
    console.log(params)
    try {
        var validate_id = !validator.isEmpty(params.id);
        
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            mesage: 'Error en tipo de datos'
        });
    }

    if (validate_id) {
        esaProductSchema.findById({_id:ObjectId(params.id)},(err, updateProduct) => {
            updateProduct.stock = updateProduct - params.quantity;
            console.log(updateProduct.stock);
            updateProduct.save((err, esaProductStored) => {
                if (err || !esaProductStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } 
                return res.status(200).send({
                    status: 'OK',
                    message: 'el articulo se ha actualizado',
                    data: esaProductStored
                }); 
            });
        })

    } else {

        return res.status(404).send({
            status: 'error',
            mesage: 'datos imcompletos'
        });
    }

},

     /**
     * Funcion name:  createReview
     * Funcionalidad: Guarda una reseña en la base de datos
     * 
     */
      createReview:  async (req, res) => {
        var params = req.body;
        console.log(params);
        //guardar imagenes
        try {
            var validate_reviewer = !validator.isEmpty(params.reviewer);
            var validate_reviewed = !validator.isEmpty(params.reviewed);
            var validate_rate = !validator.isEmpty(toString(params.rate));
            var validate_comment = !validator.isEmpty(params.comment);
    
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos' + err
            });
        }
        
        if ( validate_comment && validate_rate && validate_reviewed && validate_reviewer ) {
        
            //crear objeto
            var esaReview = new esaReviewSchema();
            esaReview.rate = params.rate;
            esaReview.reviewer = params.reviewer;
            esaReview.reviewed = params.reviewed;
            esaReview.comment = params.comment;
            esaReview.date = Date.now();
            
            //guardar en base de datos con save
            userSchema.findOne(
                {_id:params.reviewer}, 
                (err, userUpdated) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'el articulo no se ha actualizado' + err
                        });
                    }
                    if(!userUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'el proveedor no existe'
                        });
                    }else{
                        esaReview.save((err, esaReviewSaved) => {
                            if (err || !esaReviewSaved) {
                                return res.status(500).send({
                                    status: 'error',
                                    message: err
                                });
                            } 
                            return res.status(200).send({
                                status: 'ok',
                                message: 'se ha creado la reseña',
                                data: esaReviewSaved
                            }); 
                        })
                    }
                }
            );
        } else {
    
            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },

     /**
     * Funcion name:  getReviewsUser
     * Funcionalidad: trae las reseñas de un usuario de la base de datos
     * 
     */
      getReviewsUser: (req, res) => {
        var params = req.params;
        try {
            var validate_id = !validator.isEmpty(params.id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos imcompletos' + err
            });
        }

        if (validate_id) {
            //verificar que exista
            esaReviewSchema.aggregate([
                    { $match: 
                        {
                            reviewed: params.id
                        }
                    },
                    { $lookup:
                        {
                          from: 'esausers',
                          localField: 'reviewer',
                          foreignField: 'id',
                          as: 'reviewer'
                        }
                      },
                      {
                        $project: {
                          reviewer:{
                            fullName:1
                          },
                          date:1,
                          comment:1,
                          rate:1
                        },
                      },
                      { $sort : { date : -1 } }
                ],
                (err, response) => {
                    if (err && !response) {
                        return res.status(404).send({
                            status: 'error',
                            mesage: 'El usuario no ha sido encontrado' + err
                        });
                    } else {
                        return res.status(200).send({
                            status: 'Ok',
                            data: response
                        });
                    }

                }
            )
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos incompletos'
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
        var userMail = params.mail.toLowerCase();
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
            userSchema.findOne({ 'mail': userMail}).exec((err, user) => {
                if (err && !user) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    console.log(user);
                    if(!user.active){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Cuenta no activa',
                        });
                    }else{

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
        console.log(token)
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
     * Funcion name:  createType
     * Funcionalidad: crea un tipo de producto
     * 
     */
     createType:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_id = !validator.isEmpty(toString(params.id));
            var validate_label = !validator.isEmpty(params.label);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_name  && validate_id && validate_label) {

            //crear objeto
            var esaTypes = new esaTypesSchema();

            esaTypes.name = params.name;
            esaTypes.id = params.id;
            esaTypes.label = params.label;

            //guardar en base de datos con save

            esaTypes.save((err, esaTypesStored) => {

                if (err || !esaTypesStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        status: 'ok',
                        data: esaTypesStored
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
     * Funcion name:  createCategory
     * Funcionalidad: crea una categoria de producto
     * 
     */
     createCategory:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_id = !validator.isEmpty(toString(params.id));
            var validate_label = !validator.isEmpty(params.label);

        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_name  && validate_id && validate_label) {

            //crear objeto
            var esaCategories = new esaCategoriesSchema();

            esaCategories.name = params.name;
            esaCategories.id = params.id;
            esaCategories.label = params.label;
            esaCategories.image = params.image;

            //guardar en base de datos con save

            esaCategories.save((err, esaCateoriesStored) => {

                if (err || !esaCateoriesStored) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    return res.status(200).send({
                        status: 'ok',
                        data: esaCateoriesStored
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
            userSchema.findById(params.id, (err, user) => {
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

    /**
     * Funcion name:  getProjectsById
     * Funcionalidad: trae productos de un usuario de la base de datos
     * 
     */
     getProjectsById: (req, res) => {
        var params = req.params;
        console.log(params)
        try {
            var validate_id = !validator.isEmpty(params.id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos imcompletos' + err
            });
        }

        if (validate_id) {
            //verificar que exista
            userSchema.aggregate([
                {
                    $match: {
                    _id:ObjectId(params.id)
                    }
                },
                {
                    $project: {
                    _id: {
                        $toString: "$_id"
                    }
                    }
                },
                {
                    $lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "userId",
                    as: "projectstList"
                    }
                }
                ],
                (err, response) => {
                    if (err && !response) {
                        return res.status(404).send({
                            status: 'error',
                            mesage: 'El usuario no ha sido encontrado' + err
                        });
                    } else {
                        return res.status(200).send({
                            status: 'Ok',
                            data: response
                        });
                    }

                }
            )
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos incompletos'
            });
        }
    },
    /**
     * Funcion name:  getUserTopProducts
     * Funcionalidad: trae productos de un usuario de la base de datos
     * 
     */
     getUserTopProducts: (req, res) => {
        var params = req.body;
        try {
            var validate_id = !validator.isEmpty(params.id);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos imcompletos' + err
            });
        }

        if (validate_id) {
            //verificar que exista
            //Agregar match de mas vendidos
            userSchema.aggregate([
                    { $match: 
                        {
                            id: params.id
                        }
                    },
                    { $lookup:
                        {
                        from: 'products',
                        localField: 'id',
                        foreignField: 'provider',
                        as: 'products'
                        }
                    },
                    {
                        $limit:4
                    }
                ],
                (err, response) => {
                    if (err && !response) {
                        return res.status(404).send({
                            status: 'error',
                            mesage: 'El usuario no ha sido encontrado' + err
                        });
                    } else {
                        return res.status(200).send({
                            status: 'Ok',
                            data: response
                        });
                    }

                }
            )
        } else {
            return res.status(404).send({
                status: 'error',
                mesage: 'Datos incompletos'
            });
        }
    },
    /**
     * Funcion name:  getProducts
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
    getProducts: (req, res) => {
        //verificar que exista
        esaProductSchema.find((err, products) => {
            if (err && !products) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'El usuario no ha sido encontrado'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: products
                });
            }
        });
    },
     /**
     * Funcion name:  getFeaturedProducts
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
    getFeaturedProducts: (req, res) => {
        //verificar que exista
        esaProductSchema.aggregate([
            {
                $match: 
                {
                    onSale: { $gt: 0 },
                }
            },
            {
                $limit:8
            }
            ],
            (err, products) => {
                if (err && !products) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: products
                    });
                }
            }
        );
    },
     /**
     * Funcion name:  gerProjectById
     * Funcionalidad: trae un producto de la base de datos por id
     * 
     */
      getProjectById: (req, res) => {
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
            projectSchema.findById(params.id, (err, product) => {
                if (err && !product) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El producto no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: product
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

    /**
     * Funcion name:  getProviders
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
     getProviders: (req, res) => {
        //verificar que exista
        userSchema.aggregate([
            { 
                $match: 
                    {
                        bussiness: true,
                        estado:true
                    }
                }
            ],
            (err, providers) => {
            if (err && !providers) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'El usuario no ha sido encontrado'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: providers
                });
            }
        });
    },
    /**
     * Funcion name:  getFeaturedProviders
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
    getFeaturedProviders: (req, res) => {
        userSchema.aggregate([
                { 
                    $match:{
                        bussiness: true,
                        estado:true
                    }
                },
                { 
                    $lookup:{
                        from: 'products',
                        localField: 'id',
                        foreignField: 'provider',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        productsArray:{
                            $slice: ["$products.gallery", 3]
                        },
                        bussinessName:1,
                        bussinessImage:1,
                        bussinessCategory:1,
                        bussinessLocation:1,
                        bussinessImage:1,
                        id:1
                    },
                },
                {
                    $limit:6
                }
            ],
            (err, providers) => {
                if (err && !providers) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: providers
                    });
                }
            }
        );
    },
     /**
     * Funcion name:  getStoreProviders
     * Funcionalidad: trae proveedores de la base de datos
     * 
     */
      getStoreProviders: (req, res) => {
        userSchema.aggregate([
                { 
                    $match:{
                        bussiness: true,
                        estado:true
                    }
                },
                { 
                    $lookup:{
                        from: 'products',
                        localField: 'id',
                        foreignField: 'provider',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        productsArray:{
                            $slice: ["$products.gallery", 3]
                        },
                        bussinessName:1,
                        bussinessImage:1,
                        bussinessCategory:1,
                        bussinessLocation:1,
                        bussinessImage:1,
                        id:1
                    },
                },
            ],
            (err, providers) => {
                if (err && !providers) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: providers
                    });
                }
            }
        );
    },

      /**
     * Funcion name:  getSelectorProviders
     * Funcionalidad: trae la lista de proveedores
     * 
     */
       getSelectorProviders: (req, res) => {
        userSchema.aggregate([
                { 
                    $match:{
                        bussiness: true,
                        estado:true
                    }
                },
                {
                    $project: {
                        label: "$bussinessName",
                        id:1
                    }
                }
            ],
            (err, providers) => {
                if (err && !providers) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: providers
                    });
                }
            }
        );
    },
    /**
     * Funcion name:  getCategories
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
     getCategories: (req, res) => {
        //verificar que exista
        esaCategoriesSchema.find((err, products) => {
            if (err && !products) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'El usuario no ha sido encontrado'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: products
                });
            }
        });
    },
    /**
     * Funcion name:  getTypes
     * Funcionalidad: trae un usuario de la base de datos
     * 
     */
     getTypes: (req, res) => {
        //verificar que exista
        esaTypesSchema.find((err, types) => {
            if (err && !types) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'El usuario no ha sido encontrado'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: types
                });
            }
        });
    },

    formularioCorreo: (req, res) => {
        mailer(req.body);
        return res.status(200).send({
            status: 'Ok',
            mesage: 'buena',
        });
    },

    deleteFiles: async (req, res)=>{
        const params= req.body;
        var errorMessage = '';
        
        params.gallery.map((item,i)=>{
            fs.unlink('./uploads/images/'+item, (err)=>{
                errorMessage='hubo un error';
            })
        })
        if(errorMessage===''){

            return res.status(200).send({
                status: 'ok',
                message:'Good'
            })
        }else{

            return res.status(404).send({
                status: 'error',
                message:errorMessage
            })
        }
    }

};
module.exports = usersController;