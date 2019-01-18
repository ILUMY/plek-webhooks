# Sample to connect to Pleks Webhook API
For more information about Plek see, http://plek.co
This sample project can be used to upload files to Plek via the API and send chat notifications via a webhook

## Sample Project
Update this fields with the correct credentials

```
const plekDomain = '';
const webhook = ''; // create web hook at /adminpanel/apiapp/overview
const groupId = ''; // groupId to upload file to
const oauthClientid = 'upload'; // clientid you received from Plek
const oauthSecret = ''; // secret you received from Plek
```

To run the sample code execute the following commands
```
npm install
node index.js
```

## Endpoints
### File upload

| Endpoint | /services/uploadFile |
|---|---|
| Authentication | oauth2 |
| Method | POST |

## Send chat message

| Endpoint | /services/webhook/[token] |
|---|---|
| Authentication | Token |
| Method | POST |
| Params | username, text |
