
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const multer=require("multer");
const path=require("path");
const cors=require("cors");

require('dotenv').config();
const PORT=process.env.PORT || 4000;
const DB=process.env.DB;


app.use(express.json());
app.use(cors());

//Database connection with MongoDB:
mongoose.connect(DB).then(() => console.log("MongoDB Connected Successfully!"));

//API Creation
app.get("/",(req,res)=>{
    res.send("Express app is running");
})

//multer-it is used to store images
// Image Storage Engine
const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

//middleware instance for multer
const upload=multer({storage:storage})

//creating upload endpoint
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`https://ecommercestore-backend.onrender.com/images/${req.file.filename}`
    })
})


//Schema for creating Products
const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true
    },
})


//creating api for adding products
app.post("/addproduct",async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//creating api for deleting products
app.post("/removeproduct",async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})


//creating api for getting all products
app.get('/allproducts',async(req,res)=>{
    let products=await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//Schema creating fo user model

const Users=mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    cartData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User Found With same Email"})
    }
    let cart={}
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })

    await user.save();

    const data={
        user:{
            id:user.id
        }
    }

    const token=jwt.sign(data,'secret_ecom'); 
    res.json({success:true,token})
})

//creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
    
})

//Creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("Newcollection Fetched")
    res.send(newcollection);
}) 

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women)  
})

//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({success:false,errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }catch(eror){
            res.status(401).send({errors:"Please Authenticate using a valid token"})
        }
    } 
}

//creating endpoint for adding products in cartData
app.post('/addtocart',fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//creating endpoint to remove product from cartData
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

//creating endpoint to get cartData

app.post('/getcart',fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


//Server Running
app.listen(PORT,(error)=>{
    if(!error){
        console.log(`Server is running on PORT ${PORT}`);
    }else{
        console.log(("Error : "+error));      
    }   
})
