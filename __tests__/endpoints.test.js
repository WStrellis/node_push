const endpoints = require('../src/endpoints')

describe('tests for sendPublicKey', () => {
    test('should return public key', () => {
        const pub = 'hgl'
        process.env.VAPID_PUBLIC_KEY = pub

        const req = {}
        const res = {
            status: function status(code) {
                this.status_code = code
                return this
            },
            send: function send(res_body) {
                this.body = res_body
                return this
            },
        }
        const actual = endpoints.sendPublicKey(req, res, pub)
        expect(actual.body.publicKey).toBe(pub)
    })
})

describe('tests for subscribe', () => {
    test('should save subscription', () => {
        const subscriptions = new Map()
        const req = {
            body: {
                endpoint: 'http://foo.bar',
                keys: {
                    auth: 'foo',
                },
            },
        }
        const res = {
            status: function status(code) {
                this.status_code = code
                return this
            },
            send: function send(res_body) {
                this.body = res_body
                return this
            },
        }
        const actual = endpoints.subscribe(req, res, subscriptions)
        expect(subscriptions.size).toBe(1)
    })
})

describe('tests for unsubscribe', () => {
    test('should delete subscription', async () => {
        const subscriptions = new Map()
        subscriptions.set('https://foo', { endpoint: 'https://foo' })
        subscriptions.set('https://bar', { endpoint: 'https://bar' })

        expect(subscriptions.size).toBe(2)
        const req = {
            query: {
                subscription: 'https://foo',
            },
        }
        const res = {
            status: function status(code) {
                this.status_code = code
                return this
            },
            send: function send(res_body) {
                this.body = res_body
                return this
            },
        }
        await endpoints.unsubscribe(req, res, subscriptions)
        expect(subscriptions.size).toBe(1)
    })
})
