const mongoose = require("mongoose");


const BookingSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "consumer",
        required:true
    },
    items : [{
        itemId : {
            type :mongoose.Schema.Types.ObjectId,
            ref: "listing",
            required:true
        }
        
    }]

    
},  {timestamps : true})


module.exports = mongoose.model("BookingSchema", BookingSchema)

