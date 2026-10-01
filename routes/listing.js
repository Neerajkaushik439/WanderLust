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



router.route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validatelisting, WrapAsync(listingController.createListing));

//no-listings page
router.get("/no-listings", (req, res) => {
    const { q } = req.query;
    res.render("listings/no-listings.ejs", { q });
});

//render page for creating new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit listing
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm));

router.route("/:id")
    .get(WrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validatelisting, WrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.deleteListing));




module.exports= router;








 