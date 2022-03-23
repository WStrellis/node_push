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
    subscriptions.push(req.body)
    console.log(subscriptions)
    return res.status(201).send({msg:"ok"})
}

module.exports = {
    sendPublicKey,
    subscribe,
}
