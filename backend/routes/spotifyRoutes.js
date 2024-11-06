const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');

router.get('/search', jwtAuth, async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            message: 'Search Query Missing',
        });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: query,
                type: 'artist,album,playlist,track',
            },
            headers: {
                Authorization: `Bearer ${req.user.accessToken}` 
            },
        });

        const { artists, albums, playlists, tracks } = response.data;

        res.json({
            artists: artists?.items || [],
            albums: albums?.items || [],
            playlists: playlists?.items || [],
            tracks: tracks?.items || [],
        });
    } catch (error) {
        console.log("Error searching Spotify:", error.message);
        res.status(500).json({
            message: 'Failed to fetch data from Spotify.',
        });
    }
});

module.exports = router;