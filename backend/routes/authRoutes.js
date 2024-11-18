const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const querystring = require('querystring');
const crypto = require('crypto');
const { URLSearchParams } = require('url');

dotenv.config();
const router = express.Router();

const redirectUri = process.env.REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const frontendURL = process.env.FRONTEND_URL

router.get('/login', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    const scope = encodeURIComponent('user-read-email user-read-private');

    res.cookie('spotify_state', state, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });

    res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    }));
});


router.get('/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    const storedState = req.cookies.spotify_state;

    if (!state || state !== storedState) {
        return res.redirect('/api#' + 
        querystring.stringify({
            error: 'state_mismatch'
        }));
    }

    if (!code) {
        return res.status(400).json({ message: 'Authorization code missing' });
    }

    const data = new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
    });

    const authOptions = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
    };

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', data, authOptions);
        const { access_token, refresh_token, expires_in } = response.data;
        console.log('Access Token:', access_token)

        const userProfile = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        let user = await User.findOne({ spotifyId: userProfile.data.id });

        if (!user) {
            user = new User({
                spotifyId: userProfile.data.id,
                accessToken: access_token,
                refreshToken: refresh_token,
                tokenExpiry: new Date(Date.now() + expires_in * 1000),
            });
        } else {
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            user.tokenExpiry = new Date(Date.now() + expires_in * 1000);
            await user.save();
        }

        await user.save();

        const token = jwt.sign({ id: user.spotifyId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('JWT Token:', token);

        res.redirect(`${frontendURL}/callback?token=${token}`);

    } catch (error) {
        console.error('Error during Spotify callback:', error.message);
        if (error.response) {
            console.error('Spotify API response:', error.response.data);
            if (error.response.data.error === 'invalid_grant') {
                return res.status(400).json({
                    message: 'Authorization code expired or invalid. Please log in again.',
                });
            }
            res.status(500).json({ message: 'Authentication failed', details: error.response.data });
        } else {
            res.status(500).json({ message: 'Authentication failed', details: error.message });
        }
    }
});

module.exports = router;