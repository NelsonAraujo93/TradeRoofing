'use strict'

var validator = require('validator');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
var UserSchema = require('../models/user');
var ServiceFormSchema = require('../models/serviceForm');
var RequestSchema = require('../models/request');
var fs= require('fs');
const sdk = require('api')('@companycam/v2.0.1#11c3by2gl1wkwvn3');
const path = require('path');
const mailer = require('./mailer');



var servicesController = {
    /**
     * Funcion name:  createService
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     createService:  async (req, res) => {
        var params = req.body;
        console.log(params);
        try {
            var validate_total = !validator.isEmpty(toString(params.total));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_total) {
            let serviceData= new ServiceFormSchema();
            serviceData.userId=params.userId;
            serviceData.projectId=params.projectId;
            serviceData.creationDate= new Date();
            serviceData.startingDate=params.startingDate;
            serviceData.chat=params.chat;
            serviceData.status=params.status;
            serviceData.note=params.note;
            serviceData.serviceType=params.serviceType;
            serviceData.deleted=false;
            
            serviceData.save((err, serviceSaved) => {
                if (err || !serviceSaved) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else{


                    const mailForm=params;
                    mailForm.mailState=1;
                    mailer(params);
                    return res.status(200).send({
                        status: 'Ok',
                        data: serviceSaved
                    });
                    
                }
            })
            //agregar precio de envio
           

        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
      /**
     * Funcion name:  updateService
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
       updateService:  async (req, res) => {
        var params = req.body;
        console.log(params);
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.chat = params.chat;
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    } 
                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {


                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  updateServiceState
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
     updateServiceState:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.status = 'Scheduled';
                updateService.startingDate=params.startingDate;

               
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    }
                    const mailForm=params;
                    mailForm.serviceStatus='Scheduled';
                    mailForm.mailState=2;
                    mailer(params);
                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {
                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  updateServiceStateWork
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
      updateServiceStateWork:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.status = 'Working on it';

                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    }

                    const mailForm=params;
                    mailForm.serviceStatus='Working on it';
                    mailForm.mailState=2;
                    mailer(params);
                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {
                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  updateServiceStateFinished
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
     updateServiceStateFinished:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.status = 'Finished';
                //updateService.startingDate=params.startingDate;
               
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    }
                    const mailForm=params;
                    mailForm.serviceStatus='Finished';
                    mailForm.mailState=2;
                    mailer(params);

                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {
                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  uploadPDf
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
      uploadPDf:  async (req, res) => {
        var params = req.body;
        console.log(req.file);
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.invoiceUrl = req.file.filename;
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    }
                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {
                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  uploadPDfImages
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
         uploadPDfImages:  async (req, res) => {
            var params = req.body;
            try {
                var validate_id = !validator.isEmpty(toString(params.id));
               
            } catch (err) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Error en tipo de datos'
                });
            }
    
            if (validate_id) {
                ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                    updateService.imageReportUrl = req.file.filename;
                    updateService.status='Finished';
                    updateService.finishedDate=new Date();
                    updateService.save((err, updatedServiceForm) => {
                        if (err || !updatedServiceForm) {
                            return res.status(500).send({
                                status: 'error',
                                message: err
                            });
                        }


                        const mailForm=params;
                        mailForm.imageReportUrl=updatedServiceForm.imageReportUrl;
                        mailForm.invoiceUrl=updatedServiceForm.invoiceUrl;
                        mailForm.mailState=4;
                        mailer(params);
                        ServiceFormSchema.aggregate([
                            {
                                $match: {
                                    _id:ObjectId(updatedServiceForm._id),
                                }
                            },
                            {
                                $lookup: {
                                  from: 'projects',
                                  localField: 'projectId',
                                  foreignField: 'id',
                                  as: 'projectData'
                                }},
                        ], (err, project) => {
                            if (err && !project) {
                                return res.status(404).send({
                                    status: 'error',
                                    mesage: 'El usuario no ha sido encontrado'
                                });
                            } else {
                                return res.status(200).send({
                                    status: 'Ok',
                                    data: project
                                });
                            }
                        })
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
     * Funcion name:  updateServiceCams
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
      updateServiceCams:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.companyCams = params.companyCams;
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    }
                    ServiceFormSchema.aggregate([
                        {
                            $match: {
                                _id:ObjectId(updatedServiceForm._id),
                            }
                        },
                        {
                            $lookup: {
                              from: 'projects',
                              localField: 'projectId',
                              foreignField: 'id',
                              as: 'projectData'
                            }},
                    ], (err, project) => {
                        if (err && !project) {
                            return res.status(404).send({
                                status: 'error',
                                mesage: 'El usuario no ha sido encontrado'
                            });
                        } else {
                            return res.status(200).send({
                                status: 'Ok',
                                data: project
                            });
                        }
                    })
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
     * Funcion name:  cancelService
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza.
     * 
     */
       cancelService:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.deleted = params.deleted;
                updateService.status='Canceled';
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    } 
                    return res.status(200).send({
                        status: 'OK',
                        message: 'the service has been updated',
                        data: updatedServiceForm
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
     * Funcion name:  finishService
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
      finishService:  async (req, res) => {
        var params = req.body;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.id));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.findById({_id:ObjectId(params.id)},(err, updateService) => {
                updateService.status = 'Canceled';
                updateService.save((err, updatedServiceForm) => {
                    if (err || !updatedServiceForm) {
                        return res.status(500).send({
                            status: 'error',
                            message: err
                        });
                    } 
                    return res.status(200).send({
                        status: 'OK',
                        message: 'the service has been updated',
                        data: updatedServiceForm
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
     * Funcion name:  getProviderServices
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     getProviderServices:  async (req, res) => {
        var params = req.params;
        
        try {
            var validate_id = !validator.isEmpty(toString(params.providerId));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.aggregate([
                {
                    $match:{
                        state:params.state,
                        providerId:params.providerId
                    },
                },
                {
                    $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productData'
                    }
                },
                {
                    $lookup: {
                    from: 'esausers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'sellerData'
                    }
                },
                {
                    $project: {
                        sellerData:{
                        fullName:1,
                        _id:1
                        },
                        productData:1,
                        date:1,
                        clientName:1,
                        total: 1,
                        city: 1,//selector de ciudades
                        comission: 1,
                        address: 1,
                        clientMail: 1,
                        clientPhone: 1,
                        clientId: 1,
                        clientHood:1,
                        clientNote:1,
                        state:1,
                        providerId: 1,
                        instalationDate: 1
                    },
                }
            ], (err, providers) => {
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
            })
        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos'
            });
        }

    },
    /**
     * Funcion name:  getFinishedServicesById
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     getFinishedServicesById:  async (req, res) => {
        var params = req.params;
        
        try {
            var validate_id = !validator.isEmpty(params.projectId);
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.aggregate([
                {
                    $match: {
                        projectId:(params.projectId),
                        status:{$in:['Finished']}
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: 'id',
                        as: 'projectData'
                    }
                }
            ], (err, projects) => {
                if (err && !projects) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: projects
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
     * Funcion name:  getFinishedServicesByUserId
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
    getFinishedServicesByUserId:  async (req, res) => {
        var params = req.params;
        
        try {
            var validate_id = !validator.isEmpty(params.userId);
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.aggregate([
                {
                    $match: {
                        userId:(params.userId),
                        status:{$in:['Finished','Canceled']}
                    }
                },
                {
                    $lookup: {
                      from: 'projects',
                      localField: 'projectId',
                      foreignField: 'id',
                      as: 'projectData'
                    }},
            ], (err, projects) => {
                if (err && !projects) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: projects
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
     * Funcion name:  getActiveServicesByUserId
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
    getActiveServicesByUserId:  async (req, res) => {
        var params = req.params;
        
        try {
            var validate_id = !validator.isEmpty(params.userId);
            
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.aggregate([
                {
                    $match: {
                        userId:(params.userId),
                        status:{$in:['Pending','Scheduled','Working on it']}
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: 'id',
                        as: 'projectData'
                    }},
            ], (err, projects) => {
                if (err && !projects) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: projects
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
     * Funcion name:  getProjectActiveService
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     getProjectActiveService:  async (req, res) => {
        var params = req.params;
        
        try {
            var validate_id = !validator.isEmpty(params.projectId);
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {
            ServiceFormSchema.aggregate([
                {
                    $match: {
                        projectId:(params.projectId),
                        status:{$in:['Pending','Scheduled','Working on it']}
                    },
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: 'id',
                        as: 'projectData'
                    }
                }
            ], (err, project) => {
                if (err && !project) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'El usuario no ha sido encontrado'
                    });
                } else {
                    return res.status(200).send({
                        status: 'Ok',
                        data: project
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
     * Funcion name:  getProjectImages
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     getProjectImages:  async (req, res) => {
        var params = req.params;
        try {
            var validate_id = !validator.isEmpty(toString(params.projectId));
           
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Error en tipo de datos'
            });
        }

        if (validate_id) {

            sdk.auth('jvLiZmwmbRcruhYcIhZTI8MBWBzOkMMwzqTnUlk3vmE');
            sdk.listProjectPhotos({tag_ids: '7840321', project_id: params.companyCams})
            .then(resp => {
                return res.status(200).send({
                    status: 'Ok',
                    data: resp
                });
            })
            .catch(err => {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'datos imcompletos'+ err
                });
            })
                
        } else {

            return res.status(404).send({
                status: 'error',
                mesage: 'datos imcompletos Validación'
            });
        }

    },
    /**
     * Funcion name:  downloadPdf
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
     downloadPdf:  async (req, res) => {
        const src = fs.createReadStream('./uploads/invoices/'+req.params.fileName);

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=sample.pdf',
            'Content-Transfer-Encoding': 'Binary'
        });

        src.pipe(res);
        
    },
     /**
     * Funcion name:  createRequest
     * Funcionalidad: Guarda un servicio en la base de datos
     * 
     */
    createRequest:  async (req, res) => {
    var params = req.body;
    try {
        var validate_total = !validator.isEmpty(toString(params.userId));
       
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            mesage: 'Error en tipo de datos'
        });
    }

    if (validate_total) {
        let requestData= new RequestSchema();
        requestData.userId=params.userId;
        requestData.projectId=params.projectId?params.userId:'';
        requestData.serviceId=params.projectId?params.userId:'';
        requestData.requestType=params.requestType;
        requestData.address=params.address;
        requestData.note=params.note;
        requestData.ownerName=params.ownerName;
        requestData.creationDate= new Date();
        
        requestData.save((err, requestSaved) => {
            if (err || !requestSaved) {
                return res.status(500).send({
                    status: 'error',
                    message: err
                });
            } else{

                const mailForm=params;
                mailForm.mailState=3;
                mailer(params);
                return res.status(200).send({
                    status: 'Ok',
                    data: requestSaved
                });
                
            }
        })
        //agregar precio de envio
       

    } else {

        return res.status(404).send({
            status: 'error',
            mesage: 'datos imcompletos'
        });
    }

    },
    /**
     * Funcion name:  getRequests
     * Funcionalidad: trae los servicios activos
     * 
     */
    getRequests: (req, res) => {
        //verificar que exista
        RequestSchema.aggregate([
            {
                $match:{
                    'finishedDate':{'$exists':false} 
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'userData'
                }
            }

        ],(err, requests)=>{
            if (err && !requests) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: requests
                });
            }
        });
    },
    /**
     * Funcion name:  getUserRequests
     * Funcionalidad: trae los servicios activos
     * 
     */
     getUserRequests: (req, res) => {
        const params=req.params;
        //verificar que exista
        RequestSchema.aggregate([
            {
                $match:{
                    'finishedDate':{'$exists':true},
                    userId:params.userId
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'userData'
                }
            }

        ],(err, requests)=>{
            if (err && !requests) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: requests
                });
            }
        });
    },
    /**
     * Funcion name:  uploadRequest
     * Funcionalidad: actualiza un servicio en la base de datos y actualiza el wallet del vendedor y proveedor
     * 
     */
    uploadRequest:  async (req, res) => {
    var params = req.body;
    try {
        var validate_id = !validator.isEmpty(toString(params.id));
       
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            mesage: 'Error en tipo de datos'
        });
    }

    if (validate_id) {
        RequestSchema.findById({_id:ObjectId(params.id)},(err, updateRequest) => {
            updateRequest.document = req.file.filename;
            updateRequest.finishedDate= new Date();
            updateRequest.save((err, updateRequest) => {
                if (err || !updateRequest) {
                    return res.status(500).send({
                        status: 'error',
                        message: err
                    });
                } else {
                    const mailForm=params;
                    mailForm.document=updateRequest.document;
                    mailForm.requestType=updateRequest.requestType;
                    mailForm.mailState=5;
                    mailer(params);
                    return res.status(200).send({
                        status: 'Ok',
                        data: updateRequest
                    });
                }
            });
        })

    } else {

        return res.status(404).send({
            status: 'error',
            mesage: 'datos imcompletos'
        });
    }

},
}
module.exports=servicesController;