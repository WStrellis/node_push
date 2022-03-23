const express = require('express')
const bodyParser = require('body-parser');
const webpush = require('web-push')


/**
 * PushApp Class
 */
class PushApp {
    constructor(){
        const vapidKeys = getVapidKeys()
        this.app = express()
        this.app.use(bodyParser.json())

        this.vapidPublicKey = vapidKeys.publicKey
        this.vapidPrivateKey = vapidKeys.privateKey

        this.port = process.env.SERVER_PORT || 3000
}
}

/**
 * Reads vapid keys from environment variables or creates them if not found 
 * @returns Object{ publicKey:str, privateKey:str}
 */
function getVapidKeys(){
    const generatedKeys = webpush.generateVAPIDKeys()

    const keys = {publicKey: process.env.VAPID_PUBLIC_KEY || "", privateKey: process.env.VAPID_PRIVATE_KEY || ""}

    if (!keys.publicKey){
        console.log("Public VAPID key not found. Using generated key.")
        keys.publicKey = generatedKeys.publicKey
    }

    if ( !keys.privateKey){
        console.log("Private VAPID key not found. Using generated key.")
        keys.privateKey = generatedKeys.privateKey
    }
    return keys
}

module.exports ={
PushApp,
getVapidKeys
    } 