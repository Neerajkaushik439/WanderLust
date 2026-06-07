const User= require("../models/user.js")
module.exports.renderSignup= (req,res)=>{
    res.render("users/signup");
 }

module.exports.signup = async(req,res,next)=>{
   console.log("aagai request");
   
   try{
      let {username,email,password}=req.body;
      const newuser= new User({email,username});
      const registereduser =await  User.register(newuser,password);
      console.log(registereduser);
      
      let redirectUrl = req.session.redirectUrl || "/listings";
      
      req.login(registereduser,(err)=>{
         if(err){
            return next(err);
         }
         req.flash("success","User saved successfully");
         res.redirect(redirectUrl);

      })
      

   }catch(e){
      req.flash("error",e.message);
      console.log("request yaha aai h")
      res.redirect("/signup");

   }

} 


module.exports.renderLogin= (req,res)=>{
    res.render("users/login")
 }


module.exports.login = async (req, res) => {
  req.flash("success","Welcome back to wanderlust")
  console.log(User.id)
  res.redirect(res.locals.redirectUrl ||"/listings")
}

module.exports.googleLoginCallback = async (req, res) => {
  req.flash("success", "Welcome back! Logged in with Google successfully.");
  res.redirect(res.locals.redirectUrl || "/listings");
}



module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        req.session.save(()=>{
            res.redirect("/listings");
        });
    })
 
 }
