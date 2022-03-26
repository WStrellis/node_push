const { getVapidKeys } = require('../src/tools')

describe('tests for getVapidKeys', () => {
    test('should return null if environment variables are not set', () => {
        const keys = getVapidKeys()
        expect(keys).toBeNull()
    })

    test('should return keys found in environment variables', () => {
        const priv = 'abc'
        const pub = 'hgl'

        process.env.VAPID_PRIVATE_KEY = "x"
        // process.env.VAPID_PRIVATE_KEY = priv
        process.env.VAPID_PUBLIC_KEY = pub

        const keys = getVapidKeys()

        expect(keys.privateKey).toBe(priv)
        expect(keys.publicKey).toBe(pub)

        process.env.VAPID_PRIVATE_KEY = ''
        process.env.VAPID_PUBLIC_KEY = ''
    })
})
