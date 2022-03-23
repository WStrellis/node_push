const webpush = require('web-push')
/**
 * Reads vapid keys from environment variables or creates them if not found
 * @returns Object{ publicKey:str, privateKey:str}
 */
function getVapidKeys() {
    const generatedKeys = webpush.generateVAPIDKeys()

    const keys = {
        publicKey: process.env.VAPID_PUBLIC_KEY || '',
        privateKey: process.env.VAPID_PRIVATE_KEY || '',
    }

    if (!keys.publicKey) {
        console.log('Public VAPID key not found. Using generated key.')
        keys.publicKey = generatedKeys.publicKey
    }

    if (!keys.privateKey) {
        console.log('Private VAPID key not found. Using generated key.')
        keys.privateKey = generatedKeys.privateKey
    }
    return keys
}

module.exports = { getVapidKeys }
