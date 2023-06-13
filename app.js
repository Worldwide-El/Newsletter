const express = require("express");
const bodyParser = require("body-parser");
const mailChimp = require("@mailchimp/mailchimp_marketing"); 
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", (req, res )=> {
    res.sendFile(__dirname + "/index.html");
});

async function addSubscriber(fName, lName, email){
    const response = await mailChimp.lists.addListMember(process.env.LIST_ID, { //// The actual value of my list-id is stored in the .env file as LIST_ID... process.env is just used in calling it.
        email_address: email,
        status: "pending",
        merge_fields: {
            FNAME: fName,
            LNAME: lName
        },
    });
    console.log('Subscriber added!:', response);
};

app.post("/", (req, res) =>{
    const { fName, lName, email } = req.body;
    addSubscriber(fName, lName, email)
    .then(() => {
        res.sendFile(__dirname + "/signin.html");
    })
    .catch((error) => {
        console.error(`Error Subscribing:`, error);
        res.status(500).sendFile(__dirname + "/failed.html")
    })
})

mailChimp.setConfig({
    apiKey: process.env.API_KEY,  // The actual value of apiKey is stored in the .env file as API_KEY... process.env is just used in calling it.
    server: process.env.SERVER  // The actual value of server is stored in the .env file as SERVER... process.env is just used in calling it.
});


PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`)
});




/*
It's worth noting that in Express.js version 4.16 and later, the express.urlencoded() middleware is built into Express.js,
making body-parser unnecessary for handling URL-encoded form data. 
So, you can use app.use(express.urlencoded({ extended: false })) directly instead of body-parser.
*/
