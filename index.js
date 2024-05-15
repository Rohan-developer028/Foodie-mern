const exp=require('express')
const app =exp()
const cors=require('cors')
const m=require('./config')
const user=require('./models/user')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const food=require('./models/food data')
const foodcategory=require('./models/food catogory')
const order=require('./models/order')
app.use(exp.json())
app.use(cors())
const jwtkey="testing is doneed"
const {body,validationResult} =require('express-validator')

app.get("/logo",(rq,rs)=>{
    rs.send("<h1>heloo</h1>")
})

app.post("/signup",
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

    let salt=await bcrypt.genSalt(10)
    let secPassword=await bcrypt.hash(rq.body.password,salt)

    let data= new user(
    {
        name:rq.body.name,
        location:rq.body.location,
        password:secPassword,
        email:rq.body.email

    }
    )
  
  let result=await data.save()
  console.log(result)

  const data1={
    autho:  {
     id:result.id
 }
}
const authToken= jwt.sign(data1,jwtkey)
return rs.send({result,authtoken:authToken})

console.log("sucess")
}
catch(error){
    rs.json({success:false})
    console.log(error)

}
})


app.post("/login",[
    body('email',"It is not a email").isEmail(),
    body('password','Password minimum length 3').isLength({min:3})
],async(rq,rs)=>{
    
    const errors=validationResult(rq)
    if(!errors.isEmpty()){
        return rs.status(400).json({
            errors:errors.array()
        })
    }

    if(rq.body.email&&rq.body.password){
       

    let userlog= await user.findOne( {email:rq.body.email} )
    if(userlog===null)
        {
            
                rs.send({err:"no user found"})
             
        }
    else{
    console.log(userlog)

     const check= await bcrypt.compare(rq.body.password,userlog.password)
    if(check){
           // rs.send({userlog})
            const data={
                autho:  {
                 id:userlog._id
             }
            }
            const authToken= jwt.sign(data,jwtkey)
            return rs.send({userlog,authtoken:authToken})
         }else{
        rs.send({err:"enter correct credential"})
       
}  
    }}
   
}
)

app.post("/displaydata",async(rq,rs)=>{
    
    
    let data= await food.find({})
    let result=await foodcategory.find({ })

    
    
    global.fooditems=data
    global.foodc=result
    rs.send([global.fooditems,global.foodc])

})


// app.post('/orderdata',async(rq,rs)=>{
//     console.log(rq.body.order_data)
//     let data1=rq.body.order_data
//     await data1.splice(0,0,{Order_date:rq.body.order_date})
//     let eId=await order.findOne({email:rq.body.email})
//   console.log(eId)
//  console.log("===================")
//     console.log(data1)
//     if(eId!==null){

//         console.log("not in null")
//         console.log(rq.body.order_data)
//         await  order.findOneAndUpdate({email:rq.body.email},
//          {   $set:{Order_data:rq.body.order_data}}
//         )
//             rs.send({success:true})
      
      
        
//     }
//     else{
         
//         console.log('i am in null')
//         console.log(data1)
//         let dat=new order({
//             email:rq.body.email,
//             Order_data:data1
//         })
//         await dat.save()
//         rs.send({success:true})
            
    
    
//     }
// })
app.post('/orderdata',async (rq, rs) => {
    console.log(rq.body.order_data);
    let data1 = rq.body.order_data.slice(); // Create a copy of the array
    data1.unshift({ Order_date: rq.body.order_date }); // Add order date to the beginning of the array
    let eId = await order.findOne({ email: rq.body.email });
    console.log(eId);
    console.log("===================");
    console.log(data1);
    if (eId !== null) {
        console.log("not in null");
        console.log(rq.body.order_data);
        await order.findOneAndUpdate({ email: rq.body.email },
            { $push: { Order_data:data1 } }
        );
        rs.send({ success: true });
    } else {
        console.log('i am in null');
        console.log(data1);
        let dat = new order({
            email: rq.body.email,
            Order_data:[ data1]
        });
        await dat.save();
        rs.send({ success: true });
    }
});
app.post("/myorder",async(rq,rs)=>{
    console.log("///////////")
    console.log(rq.body.email)
 let data= await order.findOne({email:rq.body.email})
 console.log(data)
rs.send({orderData:data})    
})  


app.post("/forgot",[
    body('email'," It is  not an email ").isEmail(),
    body('password','Password minimum lengthh  is  3').isLength({min:3})
],async(rq,rs)=>{
    const errors=validationResult(rq)
    if(!errors.isEmpty()){
        return rs.status(400).json({
            errors:errors.array()
        })
    }
    
let data= await order.findOne({email:rq.body.email})
if(data===null){
    
    rs.send({success:false})
}
 else if (data.email===rq.body.email){
    
    let salt=await bcrypt.genSalt(10)
    console.log(rq.body.password)
    let secPassword=await bcrypt.hash(rq.body.password,salt)
let response=await user.findOneAndUpdate({email:rq.body.email},{$set:{password:secPassword}})
console.log(response)
rs.send({success:true})
}
else{
   rs.send({success:false})

}
})

app.listen(5000)    