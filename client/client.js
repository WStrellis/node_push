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
async function getSubscription() {
    const swReg = await registerServiceWorker()

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
async function createSubscription(swReg, publicVapidKey) {
    const subscription = await swReg.pushManager.subscribe({
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
    // console.log(res)
    return null
}

/**
 * Register subscription with push manager on server
 * @param {PushSubscription} subscription
 */
function subscribe(subscription) {
    return fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json',
        },
    })
}

async function main() {
    // create class which stores SW subscription and has methods to update the
    // stored subscription. Those method can also update the dom.

    // wait for service worker to be ready
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready

    // add event listener for subscribe btn
    const subscribeBtn = document.querySelector('#subscribe-btn')
    subscribeBtn.addEventListener('click', async function (e) {
        const btn = e.target
        // disable button while processing
        const subscribed = await clickSubscribeBtn()
        // enable button if failed
        if (subscribed.ok) {
            const statusP = document.querySelector('#subscription-status')
            statusP.textContent = 'SUBSCRIBED'
            statusP.classList.add('bg-lightgreen')
            // keep button disable if subscribed
            btn.disabled = true
        }
    })

    // add event listener for unsubscribe btn

    // check for existing subscription
    // let subscription = await getSubscription()
    // disable subscribe button if subscription exists
    // update dom based on whether or not subscription is present
}

/**
 * Register service worker, get api key from server, create subscription,
 * send subscription to server
 * @param {Event} event
 * @returns
 */
async function clickSubscribeBtn(event) {
    try {
        const swReg = await registerServiceWorker()

        // wait for service worker to be ready
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready
        await navigator.serviceWorker.ready
        // fetch public key
        const key = await getPublicKey()
        if (!key) {
            console.error(
                'Could not get public vapid key to create subscription.'
            )
            return
        }
        // console.log(key)

        // create new subscription
        const subscription = await createSubscription(swReg, key)
        // send subscription to server
        return subscribe(subscription)
    } catch (error) {
        console.error(error)
    }
}

const subscriptionDiv = document.querySelector('#subscription-status-div')
// check if the service worker can work in the current browser
if ('serviceWorker' in navigator && 'PushManager' in window) {
    subscriptionDiv.classList.remove('d-none')
    const subscriptionStatus = document.querySelector('#subscription-status')
    const subscribeBtn = document.querySelector('#subscribe-btn')
    const unsubscribeBtn = document.querySelector('#unsubscribe-btn')

    main()
}
