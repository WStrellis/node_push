/**
 * Send VAPID public key to client
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {String} key
 * @returns
 */
function sendPublicKey(req, res, key) {
    return res.status(200).send({ publicKey: key })
}

/**
 * Add user to subscriptions array
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Array} subscriptions
 * @returns
 */
function subscribe(req, res, subscriptions) {
    subscriptions.set(req.body.endpoint, req.body)
    console.log(subscriptions)
    return res.status(201).send({ msg: 'ok' })
}

// loop over subscriptions and send notification to each one
async function sendNotification(req, res, webpush, subscriptions) {
    const reqs = []
    subscriptions.forEach((s) =>
        reqs.push(
            webpush
                .sendNotification(
                    s,
                    JSON.stringify({
                        title: req.body?.title,
                        body: req.body?.data,
                    })
                )
                .catch((err) =>
                    console.error('Error sending notification:', err)
                )
        )
    )

    await Promise.all(reqs)

    return res.status(200).send({ msg: 'ok' })
}

/**
 * Remove user's subscription for current browser from subscriptions
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Map} subscriptions
 * @returns
 */
async function unsubscribe(req, res, subscriptions) {
    if (subscriptions.has(req?.query?.subscription)) {
        subscriptions.delete(req.query.subscription)
        console.log('subscriptions', subscriptions)
        return res.status(200).send({ msg: 'ok' })
    }

    return res.status(400).send({ msg: `${req.query.subscription} not found` })
}

module.exports = {
    sendPublicKey,
    subscribe,
    sendNotification,
    unsubscribe,
}
