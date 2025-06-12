if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require('./models/listing.js');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
const ejsMate=require("ejs-mate")
app.engine('ejs', ejsMate);
const WrapAsync=require("./utils/asyncwrap.js");
const expresserror=require("./utils/expresserror.js")
const {listingschema,reviewschema}=require("./schema.js")
const Review=require("./models/review.js")

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")));
const passport= require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsroute = require("./routes/listing.js");
const reviewsroute= require("./routes/review.js");
const userroute = require("./routes/user.js");




const { STATUS_CODES } = require("http");

app.listen(8080, () => {
    console.log(`App is listening on port 8080`);
});


const dbUrl = process.env.ATLASDB_URL

main().then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
   
  await mongoose.connect(dbUrl);
  

}



//express session setup

const store = MongoStore.create({
    mongoUrl: dbUrl,
   crypto: {
       secret: process.env.SECRET
     },
     touchAfter: 24*3600  

})

store.on("error",()=>{
    console.log("error in mongo session store"+ err)
})

const sessionOpts={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}




app.use(session(sessionOpts));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    console.log(req.user)
    res.locals.currentUser = req.user;

    console.log(`📢 Received ${req.method} request for ${req.url}`);
    next();
});


app.get("/demouser",async(req,res)=>{
    let fakeuser= new User({
        email: "student123@gmail.com",
        username: "student"
    })

    let registereduser= await User.register(fakeuser,"mypassword");
    res.send(registereduser);
})





app.use("/listings/:id/reviews",reviewsroute);
app.use("/listings",listingsroute);
app.use("/",userroute) ;



app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found"))
})


app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"}=err;
    console.log(message);
    res.status(status).render("error.ejs",{message})
    
    
})




