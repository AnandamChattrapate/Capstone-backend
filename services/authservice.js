import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserTypeModel } from '../models/UserModel.js';


// register
export const register= async(userObj)=>{
    // hash the password first
    userObj.password =await bcrypt.hash(userObj.password,10);
    // create document with hashed password
    const userDoc=await UserTypeModel.create(userObj);
    // validate 
    userDoc.validate();
    // convert document to object to remove password
    const newUserObj=userDoc.toObject();
    // delete the password object
    delete newUserObj.password
    // return userObj with out password
    return newUserObj;

}

// authenticate
export const authenticate= async({email,password})=>{
    // console.log("ROLE ",role)
    // check with user mail 
    const user =await UserTypeModel.findOne({email})
    if(!user){
        const err=new Error("Invalid Email");
        err.status = 401
        throw err;
    }
    // compare password
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err=new Error("Invalid Password");
        err.status=401;
        throw err;
    }
    if(!user.isActive){
        const err=new Error("Your account is Blocked , contact admin")
        err.status=403;
        throw err;
    }
    // if (user.role!=role){
    //     const err=new Error("Your Incorrect Role ")
    //     err.status=400;
    //     throw err;

    // }
    // generate JWT token
    const token=jwt.sign({
        userId:user._id,
        role:user.role,
       email:user.email,
       
    },
    process.env.JWT_SECRET,{ expiresIn:'1h'})
    const userObj=user.toObject();
    delete userObj.password;
    return {token,user:userObj}

}   