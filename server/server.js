const express = require('express');
const app = express();
const lyricsFinder = require('lyrics-finder');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SpotifyWebApi = require('spotify-web-api-node');

const credentials = {
    redirectUri: 'http://localhost:3000',
    clientId: '658abdd1e023425d9651439b74778aae',
    clientSecret: 'ea2ea316b1e149afbc1dc3d6dbe3d426'
}

app.post('/refresh', (req, res) => {
    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
    }).catch(() => {
        res.status(400).send();
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi(credentials);
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.status(400).send();
    })
})

app.get('/lyrics', async(req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found";
    res.json({ lyrics })
})

app.listen(3001);