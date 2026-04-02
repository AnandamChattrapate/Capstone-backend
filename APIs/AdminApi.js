import exp from 'express'
export const  adminRoute=exp.Router()
import { UserTypeModel } from '../models/UserModel.js'
import { ArticleModel } from '../models/ArticleModel.js';


//Read all articles
adminRoute.get('/users/:userId',async(req,res)=>{
    try{
    // read id from params
    const {userId}=req.body.params;
    const articles=await ArticleModel.find()
    if (!articles){
        return res.status(400).json({message:"No Articles found"})
    }
    res.status(200).json({message:"All Articles",payload:articles})
    }catch(err){
        return res.status(400).json({message:err.message})
    }


})

//Block 
adminRoute.post('/block',async(req,res)=>{
    // get user Id
    const userId=req.body.userId;
    // check if user is present
    const userExists=await UserTypeModel.findById(userId)
    if(!userExists){
        return res.status(400).json({message:"user not found to block"})

    }
    const updatedUser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {isActive:false},
        {new:true}
    )
    res.status(200).json({message:"user blocked",payload:updatedUser})
    
})

//unblock user roles
adminRoute.post('/unblock',async(req,res)=>{
    // get user Id
    const userId=req.body.userId;
    // check if user is present
    const userExists=await UserTypeModel.findById(userId)
    if(!userExists){
        return res.status(400).json({message:"user not found to unblock"})

    }
    const updatedUser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {isActive:true},
        {new:true}
    )
    res.status(200).json({message:"user Unblocked",payload:updatedUser})
    
})