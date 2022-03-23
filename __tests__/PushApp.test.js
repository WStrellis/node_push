const { PushApp, getVapidKeys } = require('../PushApp')

describe('tests for PushApp', () => {
    test('should have expected properties', () => {
        const PushServer = new PushApp()

        expect(PushServer.vapidPrivateKey.length).toBeGreaterThan(0)
        expect(PushServer.vapidPublicKey.length).toBeGreaterThan(0)
        expect(PushServer.port).toBe(3000)
    })
})

describe('tests for getVapidKeys', () => {
    test('should return private and public keys which are not empty strings', () => {
        const keys = getVapidKeys()
        expect(keys.privateKey.length).toBeGreaterThan(0)
        expect(keys.publicKey.length).toBeGreaterThan(0)
    })

    test('should return keys found in environment variables', () => {
        const priv = 'abc'
        const pub = 'hgl'

        process.env.VAPID_PRIVATE_KEY = priv
        process.env.VAPID_PUBLIC_KEY = pub

        const keys = getVapidKeys()

        expect(keys.privateKey).toBe(priv)
        expect(keys.publicKey).toBe(pub)

        process.env.VAPID_PRIVATE_KEY = ''
        process.env.VAPID_PUBLIC_KEY = ''
    })
})
