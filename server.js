import express from 'express'
import { connect } from 'mongoose'
import { authorRoute } from './APIs/AuthorApi.js'
import { userRoute } from './APIs/UserApi.js'
import { adminRoute } from './APIs/AdminApi.js'
import cookieParser from 'cookie-parser'
import { commonRouter } from './APIs/CommonApi.js'
import cors from 'cors'

import {config} from 'dotenv'
config() 
// process.env => 
// to access env variable we need to call config()

const app=express()
app.use(cors({
    origin:['http://localhost:5173','http://localhost:5174'],credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/user-api',userRoute);
app.use('/author-api',authorRoute);
app.use('/admin-api',adminRoute);
app.use('/common-api',commonRouter)

 // connect to DB
 const connectDB=async()=>{
    try{
        
        await connect(process.env.DB_URL)
        console.log("DB connection success ")
        app.listen(process.env.PORT,()=>console.log("server started at PORT",process.env.PORT))

    }catch(err){
        console.log(err.message)
    }


 }
connectDB();

// to Handle Invalid Routes
app.use((req,res,next)=>{
    //console.log(req)
    res.json({message:`${req.url} is Invalid Path`})
})
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;
// && keyValue
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
    error: `${field} "${value}" already exists`    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});
