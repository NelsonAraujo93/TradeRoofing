'use strict'
const { ObjectId } = require('mongodb');
var esaUserSchema2 = require('../models/esaUser');
//const configMensaje = require('../controllers/configMensajes');

var regaliasMapper = {
    regaliasDistribution: async(regalias, buyerId) => {
      
        var referenceMap=[];

        esaUserSchema2.findOne({_id:ObjectId(buyerId)},async (err,res)=>{
            if(res.referentCode!=='0'){
                referenceMap.push({id:res.id, referentCode:res.referentCode})
                esaUserSchema2.findOne({_id:ObjectId(res.referentCode)}, async (err,res)=>{
                    if(res.referentCode!=='0'){
                        referenceMap.push({id:res.id, referentCode:res.referentCode})
                        esaUserSchema2.findOne({_id:ObjectId(res.referentCode)}, async (err,res)=>{
                            referenceMap.push({id:res.id, referentCode:res.referentCode})
                            referenceMap.push({id:0,referentCode:0});
                            console.log(referenceMap)
                        })
                    }else{
                        referenceMap.push({id:res.id, referentCode:res.referentCode})
                        referenceMap.push({id:0,referentCode:0});
                        console.log(referenceMap)
                    }
    
                })
            }else{
                referenceMap.push({id:res.id, referentCode:res.referentCode});
                referenceMap.push({id:0,referentCode:0});
            }
        })
        return referenceMap;
    },



    regaliasMaper: async (referenceMap, buyerId) =>{
        var referenceM= referenceMap;
        if(referenceM.length===3){
            const user={id:"0",referentCode:"0"};
            console.log('final 2')
            return referenceM.push(user);
        }else{
            
            console.log('final 1')
            return referenceM;
        }
    },

};
module.exports = regaliasMapper;