const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();


router.get('/login', (req, res) => {
    const scopes = encodeURIComponent('user-read-email user-read-private');
    const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
    const clientId = process.env.SPOTIFY_CLIENT_ID;

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    
    res.redirect(spotifyAuthUrl);
});


router.get('/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const { access_token, refresh_token, expires_in } = response.data;

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
        }

        await user.save();

        const token = jwt.sign({ id: user.spotifyId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Authentication successful', token });

    } catch (error) {
        console.error('Error during Spotify callback:', error.message);
        if (error.response) {
            console.error('Spotify API response:', error.response.data);
            res.status(500).json({ message: 'Authentication failed', details: error.response.data });
        } else {
            res.status(500).json({ message: 'Authentication failed', details: error.message });
        }
    }
});

router.get('/refresh', async (req, res) => {
    const { refreshToken } = req.query;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error refreshing token:', error.message);
        res.status(500).json({ message: 'Token refresh failed' });
    }
});

module.exports = router;