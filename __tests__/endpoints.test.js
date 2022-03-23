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
