const mongo =require('mongoose')

const mon = mongo.connect("mongodb://localhost:27017/foddie")
   
module.exports=mon

