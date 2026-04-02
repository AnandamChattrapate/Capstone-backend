import exp from "express";
import { authenticate, register } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
// import { upload } from "../config/multer.js";
import {upload} from '../config/multer.js'
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const authorRoute = exp.Router();

// author should see comments

//Register author(public)
authorRoute.post("/users", upload.single("profilePic"), async (req, res) => {
  let userObj = req.body;
  console.log(userObj); // now it works

  const newUserObj = await register({ ...userObj, role: "AUTHOR" });

  res.status(201).json({ message: "Author created", payload: newUserObj });
});


//Create article(protected route)
authorRoute.post("/articles",verifyToken("AUTHOR") , async (req, res) => {
  console.log('req body in creating articles ',req.body);
  //get article from req
  let article = req.body;
  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});

//Read artiles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR") , async (req, res) => {
  //get author id
  let aid = req.params.authorId;
  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email");
  //send response
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put("/articles",verifyToken("AUTHOR") ,async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content,author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set:{title,category,content},
    },
    {new:true},
  );
  //send response 
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

// delete aritcles => soft delete
// author id not needed we can read from token
// Soft delete / restore article (Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const {id} = req.params;
    const { isArticleActive } = req.body;

    // Validate input
    if (typeof isArticleActive !== "boolean") {
      return res.status(400).json({ message: "isArticleActive must be boolean" });
    }

    // Find article
    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // AUTHOR can only modify their own articles
    if (
      req.user.role=="AUTHOR" &&
      article.author.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message:"Forbidden. You can only modify your own articles",
      });
    }

    // Already in requested state
    if (article.isArticleActive === isArticleActive) {
      return res.status(400).json({
        message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
      });
    }

    // Update status
    article.isArticleActive = isArticleActive;
    await article.save();

    // Response
    res.status(200).json({
      message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
      article,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// authorRoute.put('/articles/:articleId/:authorId',verifyToken("AUTHOR"),async(req,res)=>{
//     // get article id and author id
//     const articleId=req.params.articleId;
//     const authorId=req.params.authorId;
//     // check if article exists
//     const article=await ArticleModel.findById(articleId)
    
//     if(!article){
//         return res.status(404).json({message:"Article not found"})
//     }

//     // verify author owns this article
//     console.log(article,authorId)
//     if(article.author!=authorId){
//         return res.status(401).json({message:"Cannot delete another author's article"})
//     }
//     // 
//     if (article.isArticleActive==){

//     }
//     // soft delete 
//     const deletedArticle=await ArticleModel.findByIdAndUpdate(
//         articleId,
//         {isArticleActive:toggle},
//         {new:true}
//     )
    
//     res.status(200).json({message:"Article deleted successfully",payload:deletedArticle})
// })

// is active
authorRoute.put('/articles/:articleId/',async(req,res)=>{

})

