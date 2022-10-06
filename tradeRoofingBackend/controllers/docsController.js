'use strict'

var DocsSchema = require('../models/docs');
//const configMensaje = require('../controllers/configMensajes');

var productDocController = {
 /**
     * Funcion name:  createDoc
     * Funcionalidad: crea un código de referencia para un usuario
     * 
     */
    createDoc: async (req, res) => {
        var refCode = new DocsSchema();
        var created= await refCodeSchema.findOne({'code':codeGenerated});
        if(!created){
            refCode.code = codeGenerated;
            refCode.creationDate = new Date();
            refCode.state = true;
            var inserted= await refCode.save();
            return inserted;
        }else{
            return created;
        }
    },
    /**
     * Funcion name:  findRefCode
     * Funcionalidad: crea un código de referencia para un usuario
     * 
     */
    findRefCode: (req, res) => {
        var params = req.body;

        refCodeSchema.find({ 'code': params.referentCode}).exec((err, code) => {
            if (err && !user || user.length == 0) {
                return res.status(404).send({
                    status: 'error',
                    mesage: 'El codigo no existe'
                });
            } else {
                return res.status(200).send({
                    status: 'Ok',
                    data: code
                });
            }
        });
    },
    /**
     * Funcion name:  uploadImage
     * Funcionalidad: sube una imagen a la carpeta
     * 
     */
    uploadImage: async ({image, objectId}) => {
        var file_name='imagen no cargada';
        console.log(image);
        if(!image.files){
            return res.status(404).send({
                status: 'error',
                mesage: file_name,
            });
        }
        var file_path = image.files.file0.path;
        //en servidor
        // var file_name = file_path.split('/')[2];
        // var file_ext = file_name.split('.')[1];
        var file_name = file_path.split('\\')[1];
        var file_ext = file_name.split('\.')[1];
        if(file_ext !='png' && file_ext !='jpg' && file_ext !='jpeg'){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status: 'error',
                    mesage: 'la extension de la imagen no es valida',
                });
            });
        }else{
            var esaDoc = new DocsSchema();

            esaDoc.url = file_name;
            esaDoc.type = file_ext;
            esaDoc.date = new Date();
            esaDoc.productId =  objectId;
            //guardar en base de datos con save

            await esaDoc.save((err, esaDocStored) => {

                if (err || !esaDocStored) {
                    return {status:'error', message: err}
                } else{
                    return  esaDocStored;
                }
            })
        }
    },
    /**
     * Funcion name:  uploadRule
     * Funcionalidad: sube una reglaPDF a la carpeta
     * 
     */
    uploadRule: (req, res) => {
        var file_name='pdf no cargada';
        var params= req.params;
    if(!req.files){
        return res.status(404).send({
            status: 'error',
            mesage: file_name,
        });
    }
    var file_path = params.id ? req.files.rules.path : req.files.file0.path;
    //en servidor
    // var file_name = file_path.split('/')[2];
    // var file_ext = file_name.split('.')[1];
    var file_name = file_path.split('\\')[1];
    var file_ext = file_name.split('\.')[1];
    if(file_ext !='pdf'){
        fs.unlink(file_path,(err)=>{
            return res.status(200).send({
                status: 'error',
                mesage: 'la extension de la pdf no es valida',
            });
        });
    }else{
            if(params.id){
                var tournament ={
                    rules : file_name,
                };
                var update=[
                    tournament,
                    params
                ]
                dbConnection.query("UPDATE tournaments SET  ? where id = ?", update ,(err, result) => {
                    if (err){
                        return res.status(404).send({
                            status: 'error',
                            message: 'on edit tournament' + err
                        });
                    }else{
                        return res.status(200).send({
                            status: 'Ok',
                            message: 'Torneo editado'
                        });
                    }
                });
            }else{
                return res.status(200).send({
                    status: 'Ok',
                    message: 'Regla subida',
                    data: file_name
                });
            }
        }
    },
};
module.exports = productDocController;