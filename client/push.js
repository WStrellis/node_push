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

/**
 * Register a service worker
 * @returns {ServiceWorkerRegistration}
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const swReg = await navigator.serviceWorker.register(
                './worker.js',
                {
                    scope: '/',
                }
            )
            if (swReg.installing) {
                console.log('Service worker installing')
            } else if (swReg.waiting) {
                console.log('Service worker installed')
            } else if (swReg.active) {
                console.log('Service worker active')
            }
            return swReg
        } catch (error) {
            console.error(`Registration failed with ${error}`)
        }
    }
} // end registerServiceWorker

/**
 * Get existing subscription if exists and unsubscribe
 * returns null if no subscription is found
 * https://developer.mozilla.org/en-US/docs/Web/API/PushManager
 * https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
 * @param {ServiceWorkerRegistration} swReg
 * @returns {PushSubscription}
 */
async function getSubscription(swReg) {
    await navigator.serviceWorker.ready
    // PushSubscription.subscriptionId is not available in Chrome https://chromestatus.com/feature/5283829761703936
    const subscription = await swReg.pushManager.getSubscription()
    // If a subscription was found, return it.
    if (subscription) {
        console.log('found subscription', subscription)
    } else {
        console.log('No subscription found')
    }
    return subscription
}

/**
 * Create subscription to push service
 * https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription
 * @param {ServiceWorkerRegistration} swReg
 * @param {String} publicVapidKey
 * @returns  {PushSubscription}
 */
export async function createSubscription(swReg, publicVapidKey) {
    const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    console.log('created subscription', subscription)
    return subscription
}

// get public key
export async function getPublicKey() {
    const res = await fetch('/public_key', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })

    if (res.ok) {
        const { publicKey } = await res.json()
        return publicKey
    }
    // console.log(res)
    return null
}

/**
 * Register subscription with push manager on server
 * @param {PushSubscription} subscription
 */
export function subscribe(subscription) {
    return fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json',
        },
    })
}

export class SubscriptionManager {
    constructor() {
        const sm = this
        try {
            registerServiceWorker().then((reg) => (sm.sw = reg))
            getPublicKey().then((key) => (sm.key = key))
            getSubscription(sm.sw).then((sub) => (sm.subscription = sub))
            subscribe(sm.subscription).then((res) => {
                if (res.ok) {
                    sm.subscribed = true
                } else {
                    sm.subscribed = false
                }
            })
        } catch (err) {
            console.log('error creating SubscriptionManager:', err)
        }
    }

    debug() {
        console.log('ServiceWorkerRegistration:', this.sw)
        console.log('public key:', this.key)
        console.log('subscription:', this.subscription)
    }

    async subscribeToNotifications() {
        this.subscription = await createSubscription(this.subscription)
        const res = await subscribe(this.sw, this.key)
        if (res.ok) {
            this.subscribed = true
        } else {
            console.log(res)
            this.subscribed = false
        }
    }
}
