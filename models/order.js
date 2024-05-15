const  ex = require('express')
const app=ex()
require('../config')
const mongo=require('mongoose')

let oderschema=mongo.Schema({
 email:{
    unique:true,
    type:String,
    required:true
 },
 Order_data:{
    type:Array,
    required:true
 }

})
order=mongo.model('order_datas',oderschema)
module.exports=order