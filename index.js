const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const appRoute = require('./routes/app');
const dotenv=require("dotenv");
dotenv.config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use('/', appRoute);

app.get('/outh', (req,res) => {
    if(!req.query.code){
        res.status(500);
        res.send({
            error: "Looks like we are not getting code"
        });
        console.log("looks like we are not getting code");
    }
    else{
        request({
            url: "https://slack.com/api/outh.access",
            qs:{
                code: req.query.code,
                client_id: clientId,
                client_secret : clientSecret
            },
            method: "GET"
        },(err, response, body) => {
            if(err) throw err;
            res.json(body)
        })
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});