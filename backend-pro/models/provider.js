const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema(
    {
        headLine: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    contactInfo: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    address: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    businessName: {
        type: String,
        required: true
    },
    statistics: [statisticSchema]
}, { timestamps: true });

module.exports = mongoose.model('provider', providerSchema);
