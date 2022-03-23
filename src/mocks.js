/*
 ServerResponse {
        status: [Function: status],
        links: [Function (anonymous)],
        send: [Function: send],
        json: [Function: json],
        jsonp: [Function: jsonp],
        sendStatus: [Function: sendStatus],
        sendFile: [Function: sendFile],
        sendfile: [Function (anonymous)],
        download: [Function: download],
        type: [Function: contentType],
        contentType: [Function: contentType],
        format: [Function (anonymous)],
        attachment: [Function: attachment],
        append: [Function: append],
        header: [Function: header],
        set: [Function: header],
        get: [Function (anonymous)],
        clearCookie: [Function: clearCookie],
        cookie: [Function (anonymous)],
        location: [Function: location],
        redirect: [Function: redirect],
        vary: [Function (anonymous)],
        render: [Function: render]
      }
*/
const mockResponse = (status) => {
    const res = {}
    // replace the following () => res
    // with your function stub/mock of choice
    // making sure they still return `res`
    res.status = async () => status
    //   res.json = () => res
    //   res.send= () =>
    return res
}
/*
https://nodejs.org/api/http.html#class-httpincomingmessage

IncomingMessage {
        header: [Function: header],
        get: [Function: header],
        accepts: [Function (anonymous)],
        acceptsEncodings: [Function (anonymous)],
        acceptsEncoding: [Function (anonymous)],
        acceptsCharsets: [Function (anonymous)],
        acceptsCharset: [Function (anonymous)],
        acceptsLanguages: [Function (anonymous)],
        acceptsLanguage: [Function (anonymous)],
        range: [Function: range],
        param: [Function: param],
        is: [Function: is],
        protocol: [Getter],
        secure: [Getter],
        ip: [Getter],
        ips: [Getter],
        subdomains: [Getter],
        path: [Getter],
        hostname: [Getter],
        host: [Getter],
        fresh: [Getter],
        stale: [Getter],
        xhr: [Getter]
      }
    */

const mockRequest = (
    body = null,
    query = '',
    params = {},
    sessionData = ''
) => {
    return {
        body,
        query,
        params,
        session: { data: sessionData },
    }
}

module.exports = {
    mockRequest,
    mockResponse,
}
