'use strict'

const nodemailer = require('nodemailer');
var userSchema = require('../models/user');
var projectSchema = require('../models/project');
var ServiceFormSchema = require('../models/serviceForm');
var RequestSchema = require('../models/request');
var mongoose = require('mongoose');
const path = require('path');
const { ObjectId } = require('mongodb');
//var smtpTransport = require('nodemailer-smtp-transport');
module.exports = async (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port:465,
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: 'estudiovagos@gmail.com', // Cambialo por tu email
            pass: 'vagosstudios2021', // Cambialo por tu password
            clientId:'225067350835-pprk52q88g18s5fu752ju41fko1fvp5v.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04kMoaONaNMPfCgYIARAAGAQSNwF-L9IrcsOgzBnneCpWvqPa_GWBe9H5pKnBlWNqVNoEEr-UntTuExr7fqoVJ5E0rjyq86sRrPk',
        }
    });
    if(formulario.mailState===0){
        const mail = {
        from: 'Trade roofing' + '<estudiovagos@gmail.com>',
        to: formulario.mail, // Cambia esta parte por el destinatario
        subject: 'Verification mail',
        html: 'Hello, Click on the next url to activate your account.<br><br><br><br>'+
        'URL: <a href="'+formulario.url+'"> Activation Link </a>'
        };
        transporter.sendMail(mail, function (err, info) {
            if (err){
                console.log(err);
            }else{
                console.log(info);
            }
        });
    }else if(formulario.mailState===1){
        const project=await projectSchema.findOne({id:formulario.projectId});
        const user=await userSchema.findOne({id:formulario.userId});

        console.log(project.name, user.name);
        const mail = {
            from: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',
            to: '<estudiovagos@gmail.com>', // Cambia esta parte por el destinatario
            subject: 'New service',
            html: 'Hello manager, there is a new service, check your manager api.<br><br><br><br>'+
            'User:'+user.name+'<br>'+
            'Property name:'+project.name+'<br>'+
            'Service type:'+formulario.serviceType+'<br>'
        }
        transporter.sendMail(mail, function (err, info) {
            if (err){
                console.log(err);
            }else{
                console.log(info);
            }
        });
    }else if(formulario.mailState===2){
        console.log(formulario);
        await ServiceFormSchema.aggregate([
            {
                $match: {
                    _id:ObjectId(formulario.id),
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'userData'
                }
            },
        ], async (err, property) => {
            const user=await userSchema.findOne({id:property[0].userId});
            const mail = {
                from: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',
                to: user.mail, // Cambia esta parte por el destinatario
                subject: 'There is an update in your service',
                html: 'Hello <strong>'+ user.name +'</strong>, this is a state update mail, your service:'+'<br><br><br><br>'+
                '<strong>Trade roofing web app </strong>'
            }
            transporter.sendMail(mail, function (err, info) {
                if (err){
                    console.log(err);
                }else{
                    console.log(info);
                }
            });
        })


       
    }else if(formulario.mailState===3){
        console.log(formulario);
        
        const user=await userSchema.findOne({id:formulario.userId});
        const mail = {
            from: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',
            to: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',// Cambia esta parte por el destinatario
            subject: 'There is a new '+formulario.requestType+' request',
            html: 'Hello manager, this is a new request update mail'+'<br><br><br><br>'+
            '<strong>Check the request window to get more info </strong>'
        }
        transporter.sendMail(mail, function (err, info) {
            if (err){
                console.log(err);
            }else{
                console.log(info);
            }
        });
        


       
    }
    else if(formulario.mailState===4){
        await ServiceFormSchema.aggregate([
            {
                $match: {
                    _id:ObjectId(formulario.id),
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'userData'
                }
            },
        ], async (err, property) => {
            console.log(property[0])
            const mail = {
                from: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',
                to: property[0].userData[0].mail,// Cambia esta parte por el destinatario
                subject: 'There is a new '+formulario.requestType+' request',
                html: 'Hello manager, this is a new request update mail'+'<br><br><br><br>'+
                '<strong>Check the request window to get more info </strong>',
                attachments:[
                    {
                        filename: 'Invoice.pdf', // <= Here: made sure file name match
                        path: path.join(__dirname, '../uploads/invoices/'+formulario.invoiceUrl), // <= Here
                        contentType: 'application/pdf'
                    },
                    {
                        filename: 'Imagereport.pdf', // <= Here: made sure file name match
                        path: path.join(__dirname, '../uploads/invoices/'+formulario.imageReportUrl), // <= Here
                        contentType: 'application/pdf'
                    }
                ]
            }
            transporter.sendMail(mail, function (err, info) {
                if (err){
                    console.log(err);
                }else{
                    console.log(info);
                }
            });
        })


       
    }else if(formulario.mailState===5){
        await RequestSchema.aggregate([
            {
                $match: {
                    _id:ObjectId(formulario.id),
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'id',
                    as: 'userData'
                }
            },
        ], async (err, property) => {
           const mail = {
                from: 'Trade roofing web-app' + '<estudiovagos@gmail.com>',
                to: property[0].userData[0].mail,// Cambia esta parte por el destinatario
                subject: 'Your '+formulario.requestType+' request is ready to download',
                html: 'Hello'+ property[0].userData[0].name+', your request is ready to be download.'+'<br><br><br><br>'+
                '<strong>Check the request window to get more info </strong>',
                attachments:[
                    {
                        filename: 'Request.pdf', // <= Here: made sure file name match
                        path: path.join(__dirname, '../uploads/invoices/'+formulario.document), // <= Here
                        contentType: 'application/pdf'
                    }
                ]
            }
            transporter.sendMail(mail, function (err, info) {
                if (err){
                    console.log(err);
                }else{
                    console.log(info);
                }
            });
        })


       
    }
};