# push notifications

Browser
- [ ] register service worker
- [ ] get public key from server
- [ ] subscribe user

Server
- [x] generate vapid keys if not found
- [ ] endpoint to subscribe
- [ ] endpoint to unsubscribe
- [ ] endpoint to get public vapid key
- [ ] endpoint that triggers push notification( sends notification to endpoint defined in subscription)
- [ ] endpoint to serve html files

Worker
- [ ] function to handle push event
- [ ] function to handle clicking on notification
    - [ ] close notification
    - [ ] open window to app