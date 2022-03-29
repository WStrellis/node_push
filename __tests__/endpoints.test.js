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
        const subscriptions = []
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
        expect(subscriptions.length).toBe(1)
    })
})


describe('tests for unsubscribe', () => {
    test('should delete subscription', () => {
        const subscriptions = [{endpoint:"https://foo"},{endpoint:"https://bar"}]
        const req = {
           query: {
               subscription: 'http://foo'
           }
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
        endpoints.unsubscribe(req, res, subscriptions)
        expect(subscriptions.length).toBe(1)
    })
})


