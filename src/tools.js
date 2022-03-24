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

    if (!keys.publicKey || !keys.privateKey) {
        console.log('Public VAPID key:', keys.publicKey)
        console.log(
            'Private VAPID key (masked):',
            'X'.repeat(keys.privateKey.length)
        )
        console.log(
            'Public VAPID key or Private VAPID key not found. You can use these:',
            generatedKeys
        )
        return null
    }

    return keys
}

module.exports = { getVapidKeys }
