const mongoose = require("mongoose")

const FeedbackSchema = mongoose.Schema({
    
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"provider",
        required:true
    },

    feedbackItems : [{
        itemId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"listing",
            required:true
        },

        feedback : {
            type:String,
            required:true
        }

    }]
   
})


module.exports = mongoose.model("Feedbacks", FeedbackSchema)