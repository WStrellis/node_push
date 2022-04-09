# Push Notifications Server

This is a Node.js web server that sends push notifications to a user's browser.

_Environment Variables_  
Variables can be written to `<project_root>/.env`

| Name  | Required | Description  |
|:-:|:-:|:-:|
| VAPID_PRIVATE_KEY  | No  | Private key for push notifications  |
| VAPID_PUBLIC_KEY  | No  |  Public key for push notifications |
| MAIL_TO  | No  | email address for push notification configuration  |


_Running Docker Image_  
```
dk run -p 3000:3000 --name <CONTAINER NAME> -e VAPID_PUBLIC_KEY=<PUBLIC KEY> -e VAPID_PRIVATE_KEY=<PRIVATE KEY> push_app
```

_Notes About Push Notifications_
- If a user has an active Push subscription and the browser is open but the application is not in any current tabs the user will receive the notification pop-up when a Push event occurs
- If a user has an active Push subscription and the browser is closed the user will *NOT* receive a notification pop-up on their device until they open the browser they subscribed with.
