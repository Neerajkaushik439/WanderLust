const { ref } = require("joi");
const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String
    },
    image: {
      url : String,
      filename:String
    //   type: String,
    //   default: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    //   set:(image)=>image===""? "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" :image,
    // 
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    owner : {
      type:Schema.Types.ObjectId,
      ref: "user"

    },
    geometry : {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category:{
      type:String,
      enum:["Trending","Room", "Iconic cities","Mountains","Beach","Castles","Farm","Camping", "Arctic"]
    }

});

const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;