const  ex = require('express')
const app=ex()
require('../config')
const mongo=require('mongoose')

let foodschema=mongo.Schema({
    name:String
})
food=mongo.model('food items',foodschema)
module.exports=food