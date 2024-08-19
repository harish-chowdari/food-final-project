const express = require('express');

const router = express.Router();

const providerModel = require('../models/provider');
const consumerModel = require('../models/consumer');

router.post("/registration-provider", async (req, res) => {
    try {
        const { name, email, password, contactInfo, address, businessName } = req.body;
        
        // Check if email already exists
        const existingProvider = await providerModel.findOne({ email });
        if (existingProvider) {
            return res.status(200).json({ message: "Email already exists" });
        }

        // Create new provider if email doesn't exist
        const provider = new providerModel({ name, email, password, contactInfo, address, businessName });
        await provider.save();
        return res.status(201).json({ message: "Provider registered successfully", provider });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});




router.post("/registration-consumer", async (req, res) => {
    try {
        const { name, email, password, foodNotContains } = req.body;
        
        // Check if email already exists
        const existingConsumer = await consumerModel.findOne({ email });
        if (existingConsumer) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Ensure foodNotContains is an array
        if (!Array.isArray(foodNotContains)) {
            return res.status(400).json({ message: "foodNotContains must be an array" });
        }

        // Convert each word in foodNotContains to lowercase
        const foodNotContainsLowerCase = foodNotContains.map(word => word.trim().toLowerCase());

        // Create new consumer if email doesn't exist
        const consumer = new consumerModel({ name, email, password, foodNotContains: foodNotContainsLowerCase });
        await consumer.save();
        return res.status(201).json({ message: "Consumer registered successfully", consumer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});







router.post("/login-provider", async(req, res) => {
    try{
        const {email, password} = req.body;
        const provider = await providerModel.findOne({email}).lean();
        if(!provider){
            return res.status(400).json({message: "Provider not registered"});
        }
        if(provider.password !== password){
            return res.status(400).json({message: "Invalid password"});
        }
        return res.status(200).json({message: "Provider logged in successfully",user:{
            ...provider,
            userType:"provider"}});
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
})




router.post("/login-consumer", async(req, res) => {
    try{
        const {email, password} = req.body;
        const consumer = await consumerModel.findOne({email}).lean();
        if(!consumer){
            return res.status(400).json({message: "Consumer not registered"});
        }
        if(consumer.password !== password){
            return res.status(400).json({message: "Invalid password"});
        }
        return res.status(200).json({message: "Consumer logged in successfully",user:{
            ...consumer,
            userType:"consumer"}});
    }
    
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
})




router.get("/consumer-details/:id", async (req, res) => {
    try {
        const consumerId = req.params.id;

        const consumer = await consumerModel.findById(consumerId);
        if (!consumer) {
            return res.status(404).json({ message: "Consumer not found" });
        }

        return res.status(200).json(consumer.email);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});







module.exports = router;