const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require('./models/listing.js');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const ejsMate=require("ejs-mate")
app.engine('ejs', ejsMate);
const WrapAsync=require("./utils/asyncwrap.js");
const expresserror=require("./utils/expresserror.js")
const {listingschema}=require("./schema.js")
const Review=require("./models/review.js")


const findFreePort = require('find-free-port');
const { STATUS_CODES } = require("http");
// findFreePort(8080, (err, freePort) => {
//     if (err) throw err;
//     app.listen(freePort, () => {
//         console.log(`App is listening on port ${freePort}`);
//     });
// });
app.listen(8080, () => {
    console.log(`App is listening on port 8080`);
});
const validatelisting= (req,res,next)=>{
    console.log(req.body);
    const {error} = listingschema.validate(req.body);
    
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new expresserror(500,errmsg)
    }else{
        next();
    }

}


app.get("/",(req,res)=>{
    console.log("hi I am root");
    res.send("hi i am root")
});

main().then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))




app.get("/listings", WrapAsync( async (req,res)=>{
    let alllist = await Listing.find({});
    res.render('listings/index',{alllist});
    
    

}))
app.get("/listings/new",(req,res)=>{
    
    res.render("listings/new.ejs")

})

app.post("/listings", validatelisting,WrapAsync( async(req,res,next)=>{
   
    
        const { title, description, price, location, country, filename, url } = req.body;
    const sampleListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        images: [{ filename, url }] 
    });
    await sampleListing.save();
    res.redirect("listings")
    

}))

app.get("/listings/:id",WrapAsync( async(req,res)=>{
    let {id}=req.params;
    const list = await Listing.findById(id);
    res.render('listings/show',{list})
}))

app.get("/listings/:id/edit", WrapAsync( async(req,res)=>{
    let {id}=req.params;
    const list = await Listing.findById(id);
    res.render('listings/edit',{list})

}))


// Update 
app.put("/listings/:id",validatelisting, WrapAsync( async(req, res) => {
    let { id } = req.params;
    const { title, description, price, location, country, filename, url } = req.body;
    
    const list = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
        country,
        $set: { images: [{ filename, url }] } 
    },{ new: true });
    
    res.render("listings/show", { list }); // Assuming you're using a templating engine
}))


app.delete("/listings/:id", WrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    
    res.redirect("/listings");
   

}))

//review
//POST
app.post("/listings/:id/review",async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${listing.id}`)
    

})
app.all("*",(req,res,next)=>{
    next(new expresserror(404.,"page not found"))
})


app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"}=err;
    res.status(status).send(message);
    res.render("error.ejs",{message})
    console.log(message);
    
})




