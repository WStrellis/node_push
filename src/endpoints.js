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

module.exports = {
    sendPublicKey,
}
