const express=require("express");
const router = express.Router();
const WrapAsync=require("../utils/asyncwrap.js");
const expresserror=require("../utils/expresserror.js")
const Listing =require('../models/listing.js');
const {listingschema,reviewschema}=require("../schema.js")
const {isLoggedIn}= require("../middleware.js")
const {validatelisting}= require("../middleware.js")
const {isOwner}= require("../middleware.js")
const listingController= require("../controllers/listings.js")
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })



//index page
router.get("/", WrapAsync(listingController.index));
//render page for creating new listing
router.get("/new",isLoggedIn ,listingController.renderNewForm)
//show page
router.get("/:id",WrapAsync(listingController.showListing))


//create new listing

router.post("/", isLoggedIn , upload.single('listing[image]'),  validatelisting ,WrapAsync( listingController.createListing))


//edit listing
router.get("/:id/edit",isLoggedIn,isOwner, WrapAsync(listingController.renderEditForm))



// Update  listing 
router.put("/:id",isLoggedIn, isOwner ,upload.single('listing[image]'),validatelisting, WrapAsync( listingController.updateListing))

//delete listing 
router.delete("/:id",isLoggedIn,isOwner, WrapAsync(listingController.deleteListing))




module.exports= router;








 