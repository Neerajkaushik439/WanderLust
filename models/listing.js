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
        type: {
          filename: { type: String},
          url: { type: String }
        },
        default: {
          filename: 'listingimage',
          url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref: "Review"
      }
    ]

});

const Listing = mongoose.model("Listing",listingSchema);

module.exports=Listing;