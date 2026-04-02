import express from 'express'
export const commonRouter=express.Router();
import { authenticate } from '../services/authService.js';
import { compare } from 'bcryptjs';
import { UserTypeModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import {verifyToken} from '../middlewares/verifyToken.js'

// login
commonRouter.post('/authenticate', async (req, res, next) => {
  try {
    console.log("body : ",req.body)
    // get user credentials
    let userCred=req.body;
    // call authenticate service
    let {token,user} = await authenticate(userCred);
    // save token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(200).json({
      message: "login success",
      payload: user
    });
  } catch (err) {
    next(err); // send error to error middleware
  }
});
// logout
commonRouter.get('/logout',async(req,res)=>{
  console.log("res obj ",res.cookie)
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })

    res.status(200).json({message:"user logged out"})
})
// update password
commonRouter.put('/change-password',async(req,res)=>{
    try{// verify password
    const {currentPassword}=req.body;
    const {email}=req.body;
    const {newPassword}=req.body
    // check userExists
    const userObj=await UserTypeModel.findOne({email:email})
    console.log("userobj :",userObj)
    if(!userObj){
        return res.status(400).json({message:" user not found "})
    }
    console.log(currentPassword,userObj.password)
    // verify
    const verify=await compare(currentPassword,userObj.password)
    if(!verify){
        return res.status(400).json({message:" password does not matched "})

    }
    // hash new password
    const newHashedPassword =await bcrypt.hash(newPassword,10);
    // change password
    const updatedUserPassword=await UserTypeModel.findByIdAndUpdate(
        userObj.id,
        {password:newHashedPassword},
        {new:true})

        // $2b$10$6EblWifNnL6IXDL3DrG6heAfcl3JK.Feijiu4.EkyH.wDFXJfCshi
        // $2b$10$NSS2sebTUU7wG0NnE6mWb.VC06Mdm1qgFyW1azHoR0eNpwH4yoUyi
    return res.status(200).json({message:"password changed successfully "})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
    
    
})
//                /check-auth
commonRouter.get('/check-auth',verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
  res.status(200).json({
    message:"authenticated",
    payload:req.user
  })
})