const Listing =require('../models/listing.js');

const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }

    const alllist = await Listing.find(filter);
    res.render('listings/index.ejs', { alllist, category });
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
 
 }

module.exports.showListing=   async(req,res)=>{
    let {id}=req.params;
    console.log("request  came here")
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path: "author"
        }
    })
    .populate("owner");
   
    res.render('listings/show',{listing})
}


module.exports.createListing= async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send()
      
      

    let url = req.file.path;
    let filename = req.file.filename;
    
   
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image= { url,filename};
    newListing.geometry= response.body.features[0].geometry;
    console.log(newListing);
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("listings")
    
    
    }

module.exports.renderEditForm=  async(req,res)=>{
    let {id}=req.params;
    const list = await Listing.findById(id);
    const reviewlist = await Listing.findById(id).populate("reviews");
    let originalurl= list.image.url;
    originalurl.replace("/uploads","/uploads/h_300/w_250")

    res.render('listings/edit',{list,reviewlist})
    
    }
    
module.exports.updateListing  = async(req, res) => {
    let { id } = req.params;
    
    let listing = await Listing.findById(id);
    
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }  
    );
    if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image= { url,filename};


    }
    await updatedListing.save()
    
    res.redirect(`/listings/${listing._id}`);
    
    
    } 



module.exports.deleteListing= async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id)
req.flash("success","listing Deleted!");

res.redirect("/listings");


}     
