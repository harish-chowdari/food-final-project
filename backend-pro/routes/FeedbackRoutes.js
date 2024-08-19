const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedbackModel");
 
router.post("/send-feedback", async (req, res) => {
    try {
        const { providerId, itemId, feedback } = req.body;

        let existingFeedback = await Feedback.findOne({ "feedbackItems.itemId": itemId });

        if (existingFeedback) {
            return res.status(200).json({ alreadySubmitted: "Feedback already submitted for this item" });
        }

        existingFeedback = await Feedback.findOne({ providerId });

        if (!existingFeedback) {
            existingFeedback = new Feedback({
                providerId,
                feedbackItems: [{ itemId, feedback }]
            });
        } 
        
        else {
            if (!existingFeedback.feedbackItems) {
                existingFeedback.feedbackItems = [];
            }
            existingFeedback.feedbackItems.push({ itemId, feedback });
        }

        await existingFeedback.save();

        res.status(201).json({ feedbackResponse: "Feedback submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/all-feedbacks", async (req, res) => {
    try {
        const allFeedbacks = await Feedback.find()
        .populate("providerId")
        .populate("feedbackItems.itemId")

        res.status(200).json({ feedbacks: allFeedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get("/feedbacks-by-provider/:providerId", async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const feedbacks = await Feedback.find({ providerId })
        .populate("providerId")
        .populate("feedbackItems.itemId")

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedbacks found for this provider" });
        }

        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;
