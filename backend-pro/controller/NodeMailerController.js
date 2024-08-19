const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const axios = require("axios")

const dotenv = require("dotenv");
dotenv.config();



/** send mail from real gmail account */
const senEmail = async(req, res) => {

    const { userEmail, userName, itemName, providerName } = req.body;

    if(!userEmail)
    {
        return res.json("email required")
    }

    if(!userName)
    {
        return res.json("user name required")
    }

    if(!itemName)
    {
        return res.json("item name required")
    }

    if(!providerName)
    {
        return res.json("provider name required")
    }


    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: providerName,
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : userName,
            intro: "Congratulations your Booking is successful!",
            table : {
                data : [
                    {
                        item : itemName,
                        description: "Please reach us and claim your item...",
                        
                    }
                ]
            },
            outro: "We will reserve this for you until you claim your booking item"
        }
    }

    let mail = MailGenerator.generate(response)




    const mailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                border-radius: 5px;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
            }
            p {
                color: #666666;
            }
            .booking-details {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 5px;
            }
            
            .footer {
                font-size: 0.8em;
                color: #888888;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Booking Successful!</h1>
            <p>Dear ${userName},</p>
            <p>We are pleased to confirm your booking. Here are the details:</p>
            
        <div class="booking-details">
            <p><strong>Item Name:</strong> ${itemName}</p>
            <p><strong>Provider Name:</strong> ${providerName}</p>
        </div>

            <p>We look forward to seeing you!</p>
            
        </div>
    </body>
    </html>
    `




    let message = {
        from : process.env.EMAIL_USER,
        to : userEmail,
        subject: "Booking Successful!",
        html: mailContent
    }


    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            msg: "you should receive an email"
        })

    

        
    }).catch(error => {
        return res.status(500).json({ error })
    })

    
}


module.exports = {
    senEmail
}