const express=require("express");
const app=express();

const dotenv = require("dotenv");
dotenv.config({ path: __dirname+'.env' });


app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

const cors=require("cors");
app.use(cors());
require("./db")

 
const authRoutes = require("./routes/authentication");
app.use("/auth",authRoutes);

const providerRoutes = require("./routes/provider");
app.use("/provider",providerRoutes);


const consumerRoutes = require("./routes/ConsumerListing")
app.use("/consumer", consumerRoutes)


const BookingRoutes = require("./routes/BookingRoutes")
app.use("/booking", BookingRoutes)

const feedbackRoutes = require("./routes/FeedbackRoutes")
app.use("/feedback", feedbackRoutes)




const nodeMailerRoute = require("./routes/NodeMailerroute")
app.use("/", nodeMailerRoute)



 

app.all("/*",(req,res)=>{
    return res.status(404).json({message:"Page not found"});
});

//port listening at in the server
app.listen(3006, ()=>{
    console.log("running on port " + 3006);
});