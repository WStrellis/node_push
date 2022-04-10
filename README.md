# Push Notifications Server

This is a Node.js web server that sends push notifications to a user's browser.

_Environment Variables_  
Variables can be written to `<project_root>/.env`

| Name  | Required | Description  |
|:-:|:-:|:-:|
| VAPID_PRIVATE_KEY  | No  | Private key for push notifications  |
| VAPID_PUBLIC_KEY  | No  |  Public key for push notifications |
| MAIL_TO  | No  | email address for push notification configuration  |


## Running Docker Image  
```
dk run -d -p [PORT]:[PORT] [--name CONTAINER NAME] [-e HTTP_PORT=PORT] <-e VAPID_PUBLIC_KEY=PUBLIC KEY> <-e VAPID_PRIVATE_KEY=PRIVATE KEY> push_app
```

### Notes About Push Notifications
_Desktop_ - [https://stackoverflow.com/questions/39034950/google-chrome-push-notifications-not-working-if-the-browser-is-closed](https://stackoverflow.com/questions/39034950/google-chrome-push-notifications-not-working-if-the-browser-is-closed)
- If a user has an active Push subscription and the browser is open but the application is not in any current tabs the user will receive the notification pop-up when a Push event occurs
- If a user has an active Push subscription and the browser is closed the user will *NOT* receive a notification pop-up on their device until they open the browser they subscribed with.
- If "Continue running background apps when Google Chrome is closed" has been enabled and there are Chrome extensions installed that keep Chrome running when it has been closed the use can still receive notifications
