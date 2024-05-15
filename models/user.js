const  ex = require('express')
const app=ex()
require('../config')
const mongo=require('mongoose')

let userschema=mongo.Schema({
    name:{type:String
        , required:true},
        email:{
            type:String,
            required:true,
            unique:true
        },
        location:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        date:{type:Date,default:Date.now}
        
})
module.exports=mongo.model('users',userschema)