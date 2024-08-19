const express = require('express');

const router = express.Router();



const providerModel = require('../models/provider');
const consumerModel = require('../models/consumer');

const listingModel = require('../models/Listing');



router.get("/food-not-contains-listings", async (req, res) => {
    try {
        // Extract email from the query parameters
        const _id = req.query._id;

        // Ensure that the email parameter is present
        if (!_id) {
            return res.status(400).json({ message: "Email parameter is required" });
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const consumer = await consumerModel.findOne({ _id });

        if (!consumer) {
            return res.status(404).json({ message: "Consumer not found" });
        }

        const listings = await listingModel.find({
            useBy: { $gte: currentDate },
            foodContains: { $nin: consumer.foodNotContains }
        }).populate('provider');

        return res.status(200).json({ listings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});




router.put("/bookListing/:id", async (req, res) => {
    const { id } = req.params;
    const { status, consumerName, userId } = req.body;
    
    try {
        const updatedListing = await listingModel.findByIdAndUpdate(
            id,
            { 
                status,
                consumerName,
                userId
            },
            { new: true }
        );
        const d = await updatedListing.save();
        res.status(200).json({ message: "Listing booked successfully", d });
    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





router.get("/consumerDetails", async(req,res)=>{
    try
    {
        const data = await consumerModel.find()
        return res.status(200).json({ data })

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

})




module.exports = router