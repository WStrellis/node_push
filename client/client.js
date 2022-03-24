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

// register service worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                './worker.js',
                {
                    scope: '/',
                }
            )
            if (registration.installing) {
                console.log('Service worker installing')
            } else if (registration.waiting) {
                console.log('Service worker installed')
            } else if (registration.active) {
                console.log('Service worker active')
            }
            return registration
        } catch (error) {
            console.error(`Registration failed with ${error}`)
        }
    }
} // end registerServiceWorker

// register push api

/**
 * Get existing subscription if exists and unsubscribe
 * @returns {PushSubscription}
 */
async function getSubscription(registration) {
    const subscription = await registration.pushManager.getSubscription()
    // If a subscription was found, return it.
    if (subscription) {
        console.log('found subscription', subscription)
        subscription.unsubscribe()
        return subscription
    }
    console.log('No subscription found')
    return null
}

/**
 * Create subscription to push service
 * @param {} register
 * @param {String} publicVapidKey
 * @returns  {PushSubscription}
 */
async function createSubscription(register, publicVapidKey) {
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    console.log('created subscription', subscription)
    return subscription
}

// get public key
async function getPublicKey() {
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
    console.log(res)
    return null
}

/**
 * Register subscription with push manager on server
 * @param {PushSubscription} subscription
 */
async function subscribe(subscription) {
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json',
        },
    })
}

async function configurePushWorker() {
    const reg = await registerServiceWorker()

    // wait for service worker to be ready
    await navigator.serviceWorker.ready

    // check for existing subscription
    let subscription = await getSubscription(reg)

    if (!subscription) {
        try {
            // fetch public key
            const key = await getPublicKey()
            if (!key) {
                console.error(
                    'Could not get public vapid key to create subscription.'
                )
                return
            }
            console.log(key)

            // create new subscription
            subscription = await createSubscription(reg, key)

            //subscribe
            await subscribe(subscription)
        } catch (error) {
            console.error(error)
        }
    }
}

// check if the service worker can work in the current browser
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported')

    configurePushWorker()
}
