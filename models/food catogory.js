const  ex = require('express')
const app=ex()
require('../config')
const mongo=require('mongoose')

let foodcschema=mongo.Schema({
    CategoryName:String
})
food=mongo.model('food categorys',foodcschema)
module.exports=food