const express = require('express');

const router = express.Router();

const providerModel = require('../models/provider');
const consumerModel = require('../models/consumer');
const listingModel = require('../models/Listing');



router.get("/listings", async(req, res) => {
    try {

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const listings = await listingModel.find({
            useBy: { $gte: currentDate }, 
        }).populate('provider'); 

        console.log(listings);
        return res.status(200).json({ listings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get("/listings/:providerId", async (req, res) => {
    try {
        const { providerId } = req.params;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
 
        const listings = await listingModel.find({
            provider: providerId,
            useBy: { $gte: currentDate },
        }).populate('provider');

        console.log(listings);
        return res.status(200).json({ listings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});




router.get("/provider-statistics-details/:providerId", async (req, res) => {
    try {
        const { providerId } = req.params;

        // Find the provider by ID
        const provider = await providerModel.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Extract the required fields from statistics array
        const statisticsDetails = provider.statistics.map(statistic => ({
            headLine: statistic.headLine,
            quantity: statistic.quantity,
            createdAt : statistic.createdAt
        }));

        // Return only headline and quantity in the response
        return res.status(200).json({ statisticsDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
});






router.post("/createListing", async (req, res) => {
    try {
        const { description, useBy, price, location, contactInfo, phoneNo, dietaryRestrictions, provider, headLine, foodContains, quantity } = req.body;
        
        // Ensure foodContains is an array
        if (!Array.isArray(foodContains)) {
            return res.status(400).json({ message: "foodContains must be an array" });
        }

        // Convert each word in foodContains to lowercase
        const foodContainsLowerCase = foodContains.map(word => word.trim().toLowerCase());

        const newListing = new listingModel({
            headLine,
            description,
            useBy,
            price,
            location, 
            contactInfo,
            phoneNo,
            dietaryRestrictions,
            provider,
            foodContains: foodContainsLowerCase ,
            quantity
        });
        await newListing.save();
        return res.status(200).json({ message: "Listing created successfully" });
    } 
    
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



router.post("/add-statistics/:providerId", async (req, res) => {
    try {
        const { providerId } = req.params;
        const { headLine, quantity } = req.body;

        // Find the provider by ID
        const provider = await providerModel.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        // Add the new statistic to the provider's statistics array
        provider.statistics.push({ headLine, quantity });
        await provider.save();

        return res.status(201).json({ message: "Statistic added successfully", statistic: { headLine, quantity } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;
