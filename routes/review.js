const express=require("express");
const router = express.Router({mergeParams:true});
const WrapAsync=require("../utils/asyncwrap.js");
const expresserror=require("../utils/expresserror.js")
const {listingschema,reviewschema}=require("../schema.js")
const Review=require("../models/review.js");
const Listing =require('../models/listing.js');
const {validatereview,isLoggedIn,isReviewAuthor}= require("../middleware.js")
const reviewController= require("../controllers/review.js");





router.post("/",validatereview ,isLoggedIn,WrapAsync(reviewController.postReview));





router.delete("/:reviewId/delete/",isLoggedIn ,isReviewAuthor, WrapAsync(reviewController.deleteReview));




module.exports=router;