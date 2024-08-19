const express = require("express");
const router = express.Router();
const Bookings = require("../models/BookingModel");
const Listings = require("../models/Listing");
const moment = require('moment');
const axios = require("axios")




router.post("/add-to-bookings", async (req, res) => {
    try {
        const { userId, itemId, userEmail, userName, itemName, providerName } = req.body;
   


        let booking = await Bookings.findOne({ userId });

        if (!booking) {
            booking = new Bookings({ userId, items: [] });
            
        } 

        const existingItem = booking.items.find(item => item.itemId.equals(itemId));
        if (existingItem) {
            return res.status(200).json({ alreadyClaimed: "Item already claimed by user" });
        }

        if(!userId)
        {
            return res.status(200).json({ userIdNotFound: "please wait, until someone book this item" });

        }

        booking.items.push({ itemId });
        await booking.save();

        res.status(200).json({ userClaimed: "Successfully user claimed this Item", booking });
  
    
    } 
    
     
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-bookings/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const booking = await Bookings.findOne({ userId })
            .populate({
                path: 'items.itemId',
                populate: {
                    path: 'provider',
                    model: 'provider'
                }
            });

        if (!booking) {
            console.log({ message: "Booking not found" });

            return res.status(404).json({ message: "Booking not found" });

        }

        // Get the current date
        const currentDate = moment().startOf('day');

        // Filter bookings based on useBy date
        const filteredBookings = booking.items.filter(item => {
            const useByDate = moment(item.itemId.useBy); // Convert useBy date to moment object
            return useByDate.isSameOrAfter(currentDate, 'day'); // Check if useBy date is greater than or equal to the current date
        });

        res.status(200).json({ bookings: filteredBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get("/get-all-bookings", async (req, res) => {
    try {
        const allBookings = await Bookings.find().populate({
            path: 'items.itemId',
            populate: {
                path: 'provider',
                model: 'provider'
            }
        });

        res.status(200).json({ bookings: allBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;
