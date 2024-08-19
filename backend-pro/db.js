const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://harish:LDPasAv1fBvS38al@cluster0.qgm68yy.mongodb.net/food-project?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const db=mongoose.connection;
db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("connected to database"));