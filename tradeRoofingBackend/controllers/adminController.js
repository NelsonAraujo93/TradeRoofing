'use strict'

var validator = require('validator');
var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
var ServiceManagerSchema = require('../models/managerUser');
var UserSchema = require('../models/user');
var ServiceSchema = require('../models/serviceForm');
var RequestSchema = require('../models/request');
var bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const mailer = require('./mailer');



var adminController = {
   /**
     * Funcion name:  getUsers
     * Funcionalidad: trae los usuarios no manager
     * 
     */
    getUsers: (req, res) => {
            //verificar que exista
        UserSchema.find({manager:false, active:true}, (err, users) => {
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: users
                });
            }
        });
    },
      /**
     * Funcion name:  getUsersByManagerId
     * Funcionalidad: trae los usuarios no manager
     * 
     */
    getUsersByManagerId: async (req, res) => {
        var params=req.params;
        //verificar que exista
        var dataN={};
        await UserSchema.aggregate([
                {
                    $match:{
                        managerId:params.id
                    }
                }
            ], async (err, users) => {
                if (err && !users) {
                    return res.status(404).send({
                        status: 'error',
                        mesage: 'Database error'
                    });
                } else {
                    dataN.finishedServices=await adminController.getServicesFinished(users);
                    dataN.users=users;
                    dataN.currentServices=await adminController.getUsersServices(users);
                    dataN.requests=await adminController.getUsersRequest(users);
                    var dashBoard={};
                    dashBoard.inspections=await adminController.getInspectionsUsers(users);
                    dashBoard.services=dataN.currentServices;
                    dashBoard.coi=await adminController.getCoiServices(users);
                    dashBoard.w9=await adminController.getW9Services(users);
                    dashBoard.activeUsers=users;
                    dataN.dashBoard=dashBoard;
                    return res.status(200).send({
                        status: 'Ok',
                        mesage: 'its ok',
                        data: dataN
                    });
                    
                   
                }
            })
       
    },

    getServicesFinished: async (data)=>{
        var servicesArray=[];
        var mergeArrays2=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            var services=await ServiceSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        status:{$in:['Finished', 'Canceled']}
                    }
                },
                {

                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: 'id',
                        as: 'projectData'
                      }
                }
            ]);
            services.map((item)=>{
                mergeArrays2.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
       return mergeArrays2
    },
    getInspectionsUsers: async (data)=>{
        var servicesArray=[];
        var mergeArrays2=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            var services=await ServiceSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        serviceType:{$in:['Inspection']}
                    }
                }
            ]);
            services.map((item)=>{
                mergeArrays2.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
       return mergeArrays2
    },
    getCoiServices: async (data)=>{
        var servicesArray=[];
        var mergeArrays2=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            var services=await RequestSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        requestType:{$in:['COI']},
                        finishedDate:{$exists:false} 
                    }
                }
            ]);
            services.map((item)=>{
                mergeArrays2.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
       return mergeArrays2
    },
    getW9Services: async (data)=>{
        var servicesArray=[];
        var mergeArrays2=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            var services=await RequestSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        requestType:{$in:['W9']},
                        finishedDate:{$exists:false} 
                    }
                }
            ]);
            services.map((item)=>{
                mergeArrays2.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
       return mergeArrays2
    },
    getUsersRequest: async (data)=>{
        var mergeArrays=[];
        var servicesArray=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            
            var services=await RequestSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        finishedDate:{$exists:false}
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
            ]);
            services.map((item)=>{
                mergeArrays.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
        return mergeArrays
    },

    getUsersServices: async (data)=>{
        var mergeArrays=[];
        var servicesArray=[];
        servicesArray= await Promise.all(data.map(async (item,i)=>{
            
            var services=await ServiceSchema.aggregate([
                {
                    $match:{
                        userId:item.id,
                        status:{$in:['Pending', 'Scheduled','Working on it']}
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'projectId',
                        foreignField: 'id',
                        as: 'projectData'
                    }
                }
            ]);
            services.map((item)=>{
                mergeArrays.push(item);
            })
            if(services.length!==0){
                return servicesArray=servicesArray.concat(services);
            }else{
                return servicesArray;
            }
        }))
        return mergeArrays
    },

     /**
     * Funcion name:  assingUser
     * Funcionalidad: Guarda un usuario comerciante en la base de datos
     * 
     */
      assingUser:  async (req, res) => {
        var params = req.body;
        if (params.id) {
            //crear objeto
            let userUpdated= await UserSchema.findOneAndUpdate({_id:ObjectId(params.id)},{managerId: params.managerId});
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
     * Funcion name:  getUsersUnassigned
     * Funcionalidad: trae los usuarios no manager
     * 
     */
       getUsersUnassigned: (req, res) => {
        //verificar que exista
        UserSchema.find({managerId:{$exists:false},manager:false, superManager:false, active:true}, (err, users) => {
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: users
                });
            }
        });
    },
     /**
     * Funcion name:  getUsersManager
     * Funcionalidad: trae los usuarios no manager
     * 
     */
      getUsersManager: (req, res) => {
        //verificar que exista
        const params=req.params;
        console.log(params);
        UserSchema.find({managerId:params.id}, (err, users) => {
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: users
                });
            }
        });
    },
    /**
     * Funcion name:  getManagers
     * Funcionalidad: trae los usuarios no manager
     * 
     */
     getManagers: (req, res) => {
        //verificar que exista
        UserSchema.find({manager:true, active:true}, (err, users) => {
        if (err && !users) {
            return res.status(404).send({
                status: 'error',
                mesage: 'Database error'
            });
        } else {
            return res.status(200).send({
                status: 'Ok',
                data: users
            });
        }
    });
},
      /**
     * Funcion name:  getServices
     * Funcionalidad: trae los servicios activos
     * 
     */
    getServices: (req, res) => {
        //verificar que exista
        ServiceSchema.aggregate([
            {
                $match: {
                    status:{$in:['Pending','Scheduled','Working on it']}
                }
            },
            {
                $lookup: {
                  from: 'projects',
                  localField: 'projectId',
                  foreignField: 'id',
                  as: 'projectData'
                }
            }
        ],(err, users)=>{
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: users
                });
            }
        });
    },
     /**
     * Funcion name:  getHistory
     * Funcionalidad: trae los servicios finalizados
     * 
     */
    getHistory: (req, res) => {
        //verificar que exista
        ServiceSchema.aggregate([
            {
                $match: {
                    status:{$in:['Finished','Canceled']}
                }
            },
            {
                $lookup: {
                  from: 'projects',
                  localField: 'projectId',
                  foreignField: 'id',
                  as: 'projectData'
                }
            }
        ],(err, users)=>{
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: users
                });
            }
        });
    },
    /**
     * Funcion name:  getDashBoard
     * Funcionalidad: trae los servicios finalizados
     * 
     */
     getDashBoard: async (req, res) => {
        //verificar que exista
        /**
         * Registered Users
         * Active Users
         * COI
         * W9
         * Services Pending
         * Services Inspection
         * 
         */
        var dashBoard={};

        await ServiceSchema.aggregate([
            {
                $match: {
                    serviceType:{$in:['Inspection']}
                }
            }
        ],(err, properties)=>{
            if (err && !properties) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.inspections=properties;
            }
        });
        await ServiceSchema.aggregate([
            {
                $match: {
                    status:{$in:['Working on it','Scheduled','Pending']}
                }
            }
        ],(err, properties)=>{
            if (err && !properties) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.services=properties;
            }
        });
        await RequestSchema.aggregate([
            {
                $match: {
                    requestType:{$in:['COI']},
                    finishedDate:{$exists:false} 
                }
            }
        ],(err, properties)=>{
            if (err && !properties) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.coi=properties;
            }
        });
        await RequestSchema.aggregate([
            {
                $match: {
                    requestType:{$in:['W9']},
                    finishedDate:{$exists:false} 
                }
            }
        ],(err, properties)=>{
            if (err && !properties) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.w9=properties;
            }
        });
        await RequestSchema.aggregate([
            {
                $match: {
                    requestType:{$in:['Invoice']}
                }
            }
        ],(err, properties)=>{
            if (err && !properties) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.invoice=properties;
            }
        });
        await UserSchema.aggregate([
            {
                $match: {
                    active:false,
                    manager:false
                }
            }
        ],(err, users)=>{
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
                dashBoard.inactiveUsers=users;
            }
        });
        dashBoard.activeUsers=await UserSchema.aggregate([
            {
                $match: {
                    active:true,
                    manager:false
                }
            }
        ],(err, users)=>{
            if (err && !users) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'Database error'
                });
            } else {
               
            }
        });
     
        return res.status(200).send({
            status: 'Ok',
            data:dashBoard
        });
    },
}
module.exports = adminController;