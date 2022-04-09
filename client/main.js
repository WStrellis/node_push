import { SubscriptionManager } from './push.js'

/**
 *
 * @param {Bool} subscribed
 */
function setStatus(subscribed) {
    const subscriptionStatus = document.querySelector('#subscription-status')
    const pushForm = document.querySelector('#push-form')

    if (subscribed) {
        subscriptionStatus.textContent = 'SUBSCRIBED'
        subscriptionStatus.classList.add('bg-lightgreen')
        subscriptionStatus.classList.remove('bg-silver')
        pushForm.classList.remove('d-none')
    } else {
        subscriptionStatus.textContent = 'UNSUBSCRIBED'
        subscriptionStatus.classList.add('bg-silver')
        subscriptionStatus.classList.remove('bg-lightgreen')
        pushForm.classList.add('d-none')
    }

    document.querySelector('#subscribe-btn').disabled = subscribed
    document.querySelector('#unsubscribe-btn').disabled = !subscribed
}

export default async function main() {
    if (!'serviceWorker' in navigator || !'PushManager' in window) {
        document.querySelector('#push-not-supported').classList.remove('d-none')
        return
    }
    // create class which stores SW subscription and has methods to update the
    // stored subscription. Those method can also update the dom.
    const subManager = new SubscriptionManager()
    await subManager.init()
    setStatus(subManager.subscribed)

    document
        .querySelector('#subscription-status-div')
        .classList.remove('d-none')

    // add event listener for subscribe btn
    document
        .querySelector('#subscribe-btn')
        .addEventListener('click', async function (e) {
            // disable button while processing
            await subManager.createSubscription()
            await subManager.subscribe()
            setStatus(subManager.subscribed)
        })

    // add event listener for unsubscribe btn
    document
        .querySelector('#unsubscribe-btn')
        .addEventListener('click', async function (e) {
            // disable button while processing
            await subManager.unsubscribe()
            setStatus(subManager.subscribed)
            subManager.debug()
        })

    // submit form
    document
        .querySelector('#send-btn')
        .addEventListener('click', async function (e) {
            e.preventDefault()
            const titleInput = document.querySelector('#notification-title')
            const bodyInput = document.querySelector('#notification-body')

            try {
                await fetch('/notify', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: titleInput.value,
                        data: bodyInput.value,
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                // reset form
                titleInput.value = ''
                bodyInput.value = ''
            } catch (error) {
                console.log('error submitting form:', error)
            }
        })
}
