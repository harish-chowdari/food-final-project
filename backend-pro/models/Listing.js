const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    headLine: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },  
    location: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    contactInfo: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    phoneNo: {
        type: Number,
        required: true
    },
    dietaryRestrictions: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consumer'
    },
    useBy: {
        type: Date,
        required: true
    },
    status: {
        type: String,
    },
    consumerName:{
        type:String
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "consumer"
    },
    foodContains : {
        type : [String],
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
}, { timestamps: true });

module.exports = mongoose.model('listing', listingSchema);
