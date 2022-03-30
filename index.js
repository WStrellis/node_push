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

const subscriptions = new Map() 

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
app.delete('/unsubscribe', (req, res) => endpoints.unsubscribe(req,res,subscriptions))

// get public key
app.get('/public_key', (req,res) => endpoints.sendPublicKey(req,res, vapidKeys.publicKey) )

// send push notification
app.post('/notify',(req,res) => endpoints.sendNotification(req,res, webpush,subscriptions))

app.get('/subscriptions',(req,res) => res.status(200).send({data: [...subscriptions.entries()]}))

// serve web page
app.use(express.static(path.join(__dirname, 'client')))

const port = process.env.SERVER_PORT || 3000
app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
