// Only for testing local plek
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const plekDomain = '';
const webhook = ''; // create web hook at /adminpanel/apiapp/overview
const groupId = ''; // groupId to upload file to
const oauthClientid = 'upload'; // clientid you received from Plek
const oauthSecret = ''; // secret you received from Plek

const connectWithOauth2 = async function (code) {
  // Set the configuration settings
  const credentials = {
    client: {
      id: oauthClientid, 
      secret: oauthSecret, 
    },
    auth: {
      tokenHost: plekDomain, // Plek domain name
      authorizePath: '/oauth/server/authorize',
      tokenPath: '/oauth/server/token'
    }
  };
  // Initialize the OAuth2 Library
  const oauth2 = require('simple-oauth2').create(credentials);
  if (!code) {
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: 'http://localhost:3000/callback', // Callback url you need to implement in your application.
      scope: 'upload',
    });

    console.log(`Please open your browser with this URL: ${authorizationUri}`);
    console.log(`After logging in in plek copy the code from the url, url should look like: http://localhost:3000/callback?code=<code>`);
    console.log(`Then run ${process.argv[1]} <code>`);
  }
  else {
    // Get the access token object (the authorization code is given from the previous step).
    const tokenConfig = {
      code: code,
      redirect_uri: `http://localhost:3000/callback`,
      scope: 'upload',
    };

    // Return the access token
    try {
      const result = await oauth2.authorizationCode.getToken(tokenConfig)
      console.log('Accesstoken received next time run:');
      console.log(`${process.argv[1]} ${code} ${result.access_token}`);
      return result.access_token;
    } catch (error) {
      console.log('Access Token Error', error);
    }
  }
}
const sendMessage = async function (documentId) {
  var messageOptions = {
    username: "Plek bot",
    text: `A new file is uploaded ${plekDomain}/#/document/search/recent?previewDocument=${documentId}`,
  }
  const request = require('request');
  request.post(webhook,
    { form: messageOptions }, (err,httpResponse,body) => {
      console.log(body);
    })
}
const uploadFile = async function () {
  let token = '';
  if (process.argv.length > 3) {
    token = process.argv[3]
  }
  else {
    const code = process.argv[2];
    token = await connectWithOauth2(code);

  }

  if (token) {
    const request = require('request');
    const fs = require('fs')

    var req = request(
      {
        method: 'POST',
        url: `${plekDomain}/services/uploadFile`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, function (err, resp, body) {
        console.log(body)
        const documentInfo = JSON.parse(body);
        const documentId = documentInfo.data.id;
        sendMessage(documentId);
      });
    var form = req.form();
    form.append('file', fs.createReadStream('fileToUpload.txt'));
    form.append('initial_comment', 'testfile.txt');
    form.append('name', 'testfile.txt');
    form.append('groupId', groupId)

  }
};

uploadFile();