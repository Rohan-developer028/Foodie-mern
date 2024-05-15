const ex=require('express')
const app=ex()
const user=require('../models/user')
app.use(ex.json())
app.use(ex.Router())
const {body,validationResult} =require('express-validator')
app.post("/createruser",
[body('email',"enter correct email").isEmail(),
body('password',"minimum  length is  3").isLength({min:3})
],async (rq,rs)=>{
    const errors=validationResult(rq)
    if(!errors.isEmpty()){
        return rs.status(400).json({
            errors:errors.array()
        })
    }
try{
await user.create({
    name:rq.body.name,
    email:rq.body.email,
    password:rq.body.password,
    location:rq.body.location
})
rs.json({success:true})
}
catch(error){
    rs.json({success:false})

}
})

module.exports=app