function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export class SubscriptionManager {
    constructor() {
        this.sw = null
        this.key = null
        this.subscription = null
        this.subscribed = false
    }

    debug() {
        console.log('ServiceWorkerRegistration:', this.sw)
        console.log('public key:', this.key)
        console.log('subscription:', this.subscription)
        console.log('subscribed:', this.subscribed)
    }

    async init() {
        try {
            await this.registerServiceWorker()
            await this.getPublicKey()
            await this.getSubscription()
            await this.subscribe()
            this.debug()
        } catch (err) {
            console.log('error creating SubscriptionManager:', err)
        }
        return
    } // end init

    /**
     * Register a service worker
     * @returns {ServiceWorkerRegistration}
     */
    async registerServiceWorker() {
        try {
            const swReg = await navigator.serviceWorker.register(
                './worker.js',
                {
                    scope: '/',
                }
            )
            this.sw = swReg
        } catch (error) {
            console.error(`Registration failed with ${error}`)
        }
        return
    } // end registerServiceWorker

    async getPublicKey() {
        const res = await fetch('/public_key', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        })
        if (res.ok) {
            const { publicKey } = await res.json()
            this.key = publicKey
        } else {
            this.key = null
        }
        return
    } // end getPublicKey

    async getSubscription() {
        if (!this.sw) {
            console.log('No ServiceWorkerRegistration')
            return
        }
        await navigator.serviceWorker.ready
        // PushSubscription.subscriptionId is not available in Chrome https://chromestatus.com/feature/5283829761703936
        const subscription = await this.sw.pushManager.getSubscription()

        this.subscription = subscription
        return
    } // end getSubscription

    async subscribe() {
        if (!this.subscription) {
            console.log('No subscription to subscribe to')
            return
        }

        const res = await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(this.subscription),
            headers: {
                'content-type': 'application/json',
            },
        })

        this.subscribed = Boolean(res?.ok)
        return
    } // end subscribe

    async unsubscribe() {
        if (!this.subscription) {
            console.log('No subscription to unsubscribe to')
            return
        }
        // remove subscription from browser. Returns bool
        const isUnsubscribed = await this.subscription.unsubscribe()

        // remove subscription from server
        const endpoint = `/unsubscribe?subscription=${this.subscription.endpoint}`
        const res = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
        })

        if (res.ok && isUnsubscribed) {
            this.subscribed = false
            this.subscription = null
        }
        return
    } // end unsubscribe

    async createSubscription() {
        if (!this.sw || !this.key) {
            console.log('Missing ServiceWorkerRegistraion and/or public key')
            return
        }
        const subscription = await this.sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(this.key),
        })
        this.subscription = subscription
        return
    } // end createSubscription
}
