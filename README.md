# pp3-spotify : Spotify Music Search App

## Project Overview
This app allows users to search Spotify's catalog for music. Users can search for tracks, albums, playlists, and artists and play music on Spotify's web player.

### Features
- user login and JWT-based authentication with Spotify
- search by keyword for artists, tracks, playlists, albums
- link results directly to Spotify's web player

## Prerequisites
- [Node.js](https://nodejs.og)
- [npm](https://npmjs.com)
- a [Spotify Developer Account](https://wwww.developer.spotify.com) for API keys

## Getting Started
1. clone this repository ```git clone https://github.com/yourusername/spotify-music-search.git
cd backend```
2. run ```npm install``` to install dependencies
3. create a .env file with the following variables:
```
PORT = "your_port"
MONGODB_URI="your_mongo_uri"
SPOTIFY_CLIENT_ID="your_client_id"
SPOTIFY_CLIENT_SECRET="your_client_secret"
REDIRECT_URI="your_redirect_uri"
JWT_SECRET="your_jwt_secret"
```
4. start the server with ```npm start```
5. cd .. 
6. cd frontend
7. create a .env file with the following: 
```REACT_APP_API_URL=http://localhost:3001```
8. start the frontend with ```npm start```


## Links
- **Localhost backend**: [http://localhost3001](http://localhost:3001)
- **Localhost frontend**: [http://localhost:3000](http://localhost:3000)
- **Staging URL**: [Heroku Link](https://pp3-5c250b91333d.herokuapp.com/)
