// Express
const express = require('express');

// web-push
const webpush = require('web-push');

// body-parser
const bodyParser = require('body-parser');

// path
const path = require('path');
const req = require('express/lib/request');

require("dotenv").config()

// using express
const app = express();

// using bodyparser
app.use(bodyParser.json())

const publicVapidKey = process.env.VAPID_PUBLIC;
const privateVapidKey = process.env.VAPID_PRIVATE;

// setting vapid keys details
webpush.setVapidDetails(`mailto:${process.env.MAIL_TO}`,
publicVapidKey, privateVapidKey);

// subscribe route
app.post('/subscribe', (req, res)=>{
    // get push subscription object from the request
    const subscription = req.body;
    
    // save subscription data

    // send status 201 for the request
    res.status(201).json({})

})

// unsubscribe

// get public key
app.get('/public_key',(req,res)=>{
    res.status(200).send( VAPID_PUBLIC)
})


// send push notification
app.post('/notify',(req,res)=>{
    webpush.sendNotification(subscription, {title: req?.body?.title, body: req?.body?.data}).catch(err=> console.error(err));
})

// server web files
app.use(express.static(path.join(__dirname, "build")));

const port = process.env.SERVER_PORT || 3000
app.listen(port, ()=>{
    console.log(`server started on ${port}`)
});
