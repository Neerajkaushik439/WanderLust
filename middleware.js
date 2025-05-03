const {listingschema,reviewschema}=require("./schema.js")
const Listing =require('./models/listing.js');
const expresserror=require("./utils/expresserror.js")
const Review =require('./models/review.js');


module.exports.isLoggedIn= (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        
        req.session.redirectUrl= req.originalUrl
        
        req.flash("error","you must be logged-in to proceed");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.validatelisting= (req,res,next)=>{
    console.log(req.body);
    const {error} = listingschema.validate(req.body.listing);
    
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new expresserror(500,errmsg)
    }else{
        next();
    }

}


module.exports.validatereview= (req,res,next)=>{
    console.log(req.body);
    const {error} =reviewschema.validate(req.body);
    
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new expresserror(500,errmsg)
    }else{
        next();
    }

}


module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you don't have permission for it");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    // if (!res.locals.currentUser) {
    //     req.flash("error", "You must be logged in");
    //     return res.redirect(`/listings/${id}`);
    // }
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you don't have permission for it");
        return res.redirect(`/listings/${id}`);
    }
    next();
}