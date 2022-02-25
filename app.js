var express=require("express")
var app=express()
const path=require("path")
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")

//Variable 
const port1=8080

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use(bodyParser())
app.set("view engine","ejs")
app.get("/",function(req,res){
    res.render("index")
})
app.use(express.static(path.join(__dirname,"css")))


//initialize dummy data
var user={
    id:"kwncdhuiwplknjn",
    email:"ny587227@gmail.com",
    password:"dipllskcjef0-wp-ohyt3ri0pxknsjhdvhuei"
}


// create secret key for jwt
const jwt_secret="hello jwt token..."
const paylod={
    email:user.email,
    id:user.id
}
//create token to make link for just one time accessable
const new_secret=jwt_secret+user.password
const token=jwt.sign(paylod,new_secret,{expiresIn:'15m'})


//-----------------------------------API for forgot password ----------------
app.get("/forgot-password",function(req,res){
    res.render("forgot-password")
})
app.post("/forgot-password",function(req,res){
    let {email}=req.body
    if(email!=user.email){
        res.send("User not found in database")
    }

    //create link to send via mail

    let link=`http://localhost:8080/reset-password/${user.id}/${token}`
    
    // as of now i have used in console but it should n=be sent to registered email using gmail package
    // Implement Node mailer
    //create transporter 
    var transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth:{
            user:"loveyoubaby587227@gmail.com",
            pass:"baby@9565"
        }
    })
    
    //create option
    var options={
        from:"loveyoubaby587227@gmail.com",
        to:"ny587227@gmail.com",
        subject:"Reset your password",
        text:link
    }
    transporter.sendMail(options,function(err,info){
        if(err){
            res.send(err)
        }
        else{
            res.send("Mail has been sent to your registered email..."+info.response)
        }
    })
    console.log(link)
    // res.send("link is send to registered email id")
})

//-------------------------------------API for reset password------------------
app.get("/reset-password/:id/:token",function(req,res){
    
    //get id and token sent via link
    var {id,token}=req.params

    //verify whether id exist or not
    if(id!=user.id){
        res.send("user not found in database..")
        return 
    }

    // verify token whether token sent in link is matching or not
    const new_secret=jwt_secret+user.password
    try{

        //verify both tokens
        const paylod=jwt.verify(token,new_secret)
        res.render("reset-password")
    }
    catch(err){
        res.send(err.message)
    }
})
app.post("/reset-password/:id/:token",function(req,res){
    var{id,token}=req.params
    var {password1,password2}=req.body
    
    //verify user
    if(id!=user.id){
        res.send("invalid user..")
    }

    const new_secret=jwt_secret+user.password
    try{
        const paylod=jwt.verify(token,new_secret)

        //validate both password
        user.password=password1
        res.send(user)
    }catch(err){
        res.send(err)
    }
})
app.listen(port1,(req,res)=>{
    console.log(`Listening at http://localhost:${port1}/`)
})
