# Push Notifications Server

This is a Node.js web server that sends push notifications to a user's browser.

_Environment Variables_  
Variables can be written to `<project_root>/.env`

| Name  | Required | Description  |
|:-:|:-:|:-:|
| VAPID_PRIVATE_KEY  | No  | Private key for push notifications  |
| VAPID_PUBLIC_KEY  | No  |  Public key for push notifications |
| MAIL_TO  | No  | email address for push notification configuration  |