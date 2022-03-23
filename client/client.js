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

// check if the service worker can work in the current browser
if ('serviceWorker' in navigator) {
}

// register service worker
async function registerServiceWorker() {
    const register = await navigator.serviceWorker.register(
        new URL('./worker.js', import.meta.url),
        {
            scope: '/',
        }
    )
}

// register push api

// send notification
async function sendNotification() {
    // register push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,

        // public vapid key
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })

    // Send push notification
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'content-type': 'application/json',
        },
    })
}
