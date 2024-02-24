const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const myHeaders = new Headers();
const oauth = OAuth({
    consumer: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET, 
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});

const token = {
    key: process.env.TWITTER_ACCESS_TOKEN,
    secret: process.env.TWITTER_ACCESS_TOKEN_SECRET, 
};

const url = 'https://api.twitter.com/2/tweets';

const data = {
    text: 'Hello, world! This is a tweet posted from Node.js!!',
};

// Generate the authorization header
let authorization = oauth.toHeader(oauth.authorize({
    url,
    method: 'POST',
}, token));


myHeaders.append('Authorization', authorization.Authorization);
myHeaders.append('Content-Type', 'application/json');



// Post the tweet
fetch(url, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
});
