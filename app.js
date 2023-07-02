console.clear()
require('dotenv').config();
const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path')
const cors = require('cors')
const sgMail = require('@sendgrid/mail');
const data = require('./Data/code')

const app = express();
app.use(cors());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "Public")));


app.get('/data', (req, res) => {
    res.json(data)
})

app.get('/download', (req, res) => {
    res.download(__dirname + "/Data/Updated_Experienced.pdf")
})

app.get('/', (req, res) => {
    res.render('index');
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
        <br>
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
    res.redirect('/');
}
)
PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`SERVER STARTED AT PORT ${PORT}`)
})
