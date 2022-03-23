const path = require('path')

const express = require('express')
const webpush = require('web-push')

const { PushApp } = require('./PushApp')

const PushServer = new PushApp()

// setting vapid keys details
webpush.setVapidDetails(
    `mailto:${process.env.MAIL_TO || 'test@test.com'}`,
    PushApp.vapidPublicKey,
    PushApp.vapidPrivateKey
)

// subscribe route
app.post('/subscribe', (req, res) => {
    // get push subscription object from the request
    const subscription = req.body

    // save subscription data

    // send status 201 for the request
    res.status(201).json({})
})

// unsubscribe

// get public key
app.get('/public_key', (req, res) => {
    res.status(200).send(VAPID_PUBLIC)
})

// send push notification
app.post('/notify', (req, res) => {
    webpush
        .sendNotification(subscription, {
            title: req?.body?.title,
            body: req?.body?.data,
        })
        .catch((err) => console.error(err))
})

// serve web page
app.use(express.static(path.join(__dirname, 'client')))

const port = process.env.SERVER_PORT || 3000

PushApp.app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
