import { SubscriptionManager } from './push'

/**
 *
 * @param {Bool} subscribed
 */
function setStatus(subscribed) {
    const subscriptionStatus = document.querySelector('#subscription-status')
    subscriptionStatus.textContent = subscribed
        ? 'SUBSCRIBED'
        : 'NOT SUBSCRIBED'
    subscriptionStatus.classList.add(subscribed ? 'bg-lightgreen' : 'bg-silver')

    // keep button disabled if subscribed
    btn.disabled = subscribed
}

export default async function main() {
    if (!'serviceWorker' in navigator || !'PushManager' in window) {
        document.querySelector('#push-not-supported').classList.remove('d-none')
        return
    }
    // create class which stores SW subscription and has methods to update the
    // stored subscription. Those method can also update the dom.
    const subManager = new SubscriptionManager()
    subManager.debug()

    // wait for service worker to be ready
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready

    subscriptionDiv.classList.remove('d-none')

    // add event listener for subscribe btn
    const subscribeBtn = document.querySelector('#subscribe-btn')
    subscribeBtn.addEventListener('click', async function (e) {
        // disable button while processing
        await subManager.subscribeToNotifications()
        setStatus(subManager.subscribed)
    })

    // add event listener for unsubscribe btn
    const unsubscribeBtn = document.querySelector('#unsubscribe-btn')

    // check for existing subscription
    // let subscription = await getSubscription()
    // disable subscribe button if subscription exists
    // update dom based on whether or not subscription is present
}
