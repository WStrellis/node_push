const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const webpush = require('web-push')
const process = require("process")
require('dotenv').config()

const {getVapidKeys} = require("./src/tools")
const endpoints = require("./src/endpoints")

const app = express()
app.use(bodyParser.json())

const subscriptions = []

 const vapidKeys = getVapidKeys()
 if (!vapidKeys) process.exit(1) 

// setting vapid keys details
webpush.setVapidDetails(
    `mailto:${process.env.MAIL_TO || 'test@test.com'}`,
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

// subscribe route
app.post('/subscribe', (req, res) => endpoints.subscribe(req,res,subscriptions))

// unsubscribe

// get public key
app.get('/public_key', (req,res) => endpoints.sendPublicKey(req,res, vapidKeys.publicKey) )

// send push notification
// app.post('/notify', (req, res) => {
    // loop over subscriptions and send notification to each one
//     webpush
//         .sendNotification(subscription, {
//             title: req?.body?.title,
//             body: req?.body?.data,
//         })
//         .catch((err) => console.error(err))
// })

// serve web page
app.use(express.static(path.join(__dirname, 'client')))

const port = process.env.SERVER_PORT || 3000
app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
