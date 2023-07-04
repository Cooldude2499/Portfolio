console.clear()
require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors')
const sgMail = require('@sendgrid/mail');
const data = require('./Data/code')

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));


app.get('/data', (req, res) => {
    res.json(data)
})

app.get('/download', (req, res) => {
    res.download(__dirname + "/Data/Resume_Nikhil_Gaur.pdf")
})

app.post('/', async (req, res) => {
    console.log(req.body)
    const { name, email, subject, message, areaCode, mobile } = req.body;
    const msg = {
        to: process.env.EMAIL,
        from: process.env.EMAIL,
        subject: "From Portfolio",
        html: `<strong>
        Name: ${name}<br>
        Email: ${email}<br>
        Subject: ${subject}<br>
        Mobile: ${areaCode} - ${mobile}
        </strong>
        <b>Message:</b> ${message}`,
    };
    console.log(msg)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    //ES6
    await sgMail
        .send(msg)
        .then(() => {
            console.log("Message Successfully Sent.");
        })
        .catch((err) => {
            console.log(err)
        })
    // ES8
    // (async () => {
    //     try {
    //         await sgMail.send(msg);
    //     } catch (error) {
    //         console.error(error);

    //         if (error.response) {
    //             console.error(error.response.body)
    //         }
    //     }
    // })();
    res.statusCode(200).json({message: "Success"});
}
)
PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT ${PORT}`)
})
