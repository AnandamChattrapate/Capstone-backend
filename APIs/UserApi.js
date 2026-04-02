import exp from "express";
import { register } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {upload} from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
export const userRoute = exp.Router();

//Register user
userRoute.post("/users",upload.single("profilePic"),async (req, res, next) => {
let cloudinaryResult;

    try {
        let userObj = req.body;

        //  Step 1: upload image to cloudinary from memoryStorage (if exists)
        if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        }

        // Step 2: call existing register()
        const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
        });

        res.status(201).json({
        message: "user created",
        payload: newUserObj,
        });

    } catch (err) {

        // Step 3: rollback 
        if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }

        next(err); // send to your error middleware
    }

}
);
// userRoute.post("/users", async (req, res) => {
//   //get user obj from req
//   let userObj = req.body;
//   //call register
//   const newUserObj = await register({ ...userObj, role: "USER" });
//   //send res
//   res.status(201).json({ message: "user created", payload: newUserObj });
// });


//Read all articles protected route
userRoute.get('/articles',async(req,res)=>{
  try{
  // get all the articles
  const allArticles=await ArticleModel.find().populate("author","firstName")
  let allActiveArticles=[]
  for(let eachArticle of allArticles){
    if(eachArticle.isArticleActive){
      allActiveArticles.push(eachArticle)
    }
  }
  res.status(200).json({message:"all active articles",payload:allActiveArticles})
}catch(err){
  return res.status(400).json({message:err.message})
}
})

// Add comment to an article protected route
userRoute.put('/articles', verifyToken("USER"), async (req,res)=>{

  const {user, articleId, comment} = req.body;

  console.log(user, req.user.userId);

  if(user !== req.user.userId){
    return res.status(403).json({message:"Forbidden user"});
  }

  const newComment = {
    userId:user,
    comment:comment,
    date:new Date()
  };

  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    { $push: { comments: newComment } },
    { new: true }
  );

  if(!updatedArticle){
    return res.status(404).json({message:"Article not found"});
  }

  res.status(200).json({
    message:"New comment added",
    payload:updatedArticle
  });

});
  