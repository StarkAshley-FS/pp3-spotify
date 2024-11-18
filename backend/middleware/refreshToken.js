const User = require('../models/User');
const axios = require('axios');

const refreshAccessToken = async (refreshToken) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
};

const tokenRefreshMiddleware = async (req, res, next) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const spotifyId = req.user.spotifyId;

    if (!accessToken || !spotifyId) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    try {
        const user = await User.findOne({ spotifyId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (new Date() > new Date(user.tokenExpiry)) {
            const newAccessToken = await refreshAccessToken(user.refreshToken);

            user.accessToken = newAccessToken;
            user.tokenExpiry = new Date(Date.now() + 3600 * 1000);
            await user.save();

            req.headers['authorization'] = `Bearer ${newAccessToken}`;
        }

        next();
    } catch (error) {
        console.error('Error in token refresh middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = tokenRefreshMiddleware;