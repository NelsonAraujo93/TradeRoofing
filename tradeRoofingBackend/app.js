'use strict';

const express = require ('express')
//cargar modulos de node
const bodyParser = require('body-parser');
//const cookieparser= require ('cookie-parser');
const path = require('path');
const app = express();

//ejecutar express

//cargar las rutas
const Routes = require('./routes/route');


//middlewares algo que se ejecuta antes de las rutas o las url
//app.use(cookieparser());
//CORS para permitir peticiones desde el front
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-acces-token");

    // Add this
    if (req.method === 'OPTIONS') {

        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Max-Age', 120);
        return res.status(200).json({});
    }
    next();
});

/*
app.use('/', express.static('Api',{redirect:false}));*/
app.use('/tRoofingApp', Routes);
app.use(express.static('uploads'));
/*
app.get('*', function(req,res,next){
    res.sendFile(path.resolve('Api/index.html'));
});*/
module.exports = app;