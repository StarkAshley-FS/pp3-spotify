import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import spotifyLogo from '../images/spotifylogogreen.png';

const SearchPage = () => {
  const [results, setResults] = useState({ artists: [], albums: [], playlists: [], tracks: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get('query');
  const token = localStorage.getItem('spotifyToken');
  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);

    axios
      .get(`${apiURL}/api/search`, {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          console.error(err.response ? err.response.data : err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, token, navigate]);

  return (
    <div className="bg-gray-950 flex items-center justify-center min-h-screen py-8 px-4">
      <div className="max-w-4xl w-full text-center">
        {(!query ||
          (results.artists.length === 0 &&
            results.albums.length === 0 &&
            results.playlists.length === 0 &&
            results.tracks.length === 0)) && (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={spotifyLogo} alt="Spotify Logo" className="h-12 mb-4" />
            <h2 className="text-center text-md text-white font-bold">No Results</h2>
            <p className="text-center text-sm text-gray-400">
              Please type in a search query to get started
            </p>
          </div>
        )}
        {results.artists.length > 0 && (
          <div className="results-section mb-8">
            <h2 className="text-center text-xl text-white font-bold mb-4">Artists</h2>
            <div className="flex justify-center gap-4">
              {results.artists.slice(0, 4).map((artist, index) => (
                <div key={index} className="result-item text-center">
                  <a
                    href={`https://open.spotify.com/artist/${artist.id}`}
                  >
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="w-36 h-36 rounded-full object-cover border-2 border-gray-400"
                    />
                  </a>
                  <p className="mt-2 text-center text-sm text-gray-400 w-36">{artist.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {results.tracks.length > 0 && (
          <div className="results-section mb-8">
            <h2 className="text-center text-xl text-white font-bold mb-4">Tracks</h2>
            <div className="flex justify-center gap-4">
              {results.tracks.slice(0, 4).map((track, index) => (
                <div key={index} className="result-item text-center">
                  <a
                    href={`https://open.spotify.com/track/${track.id}`}
                  >
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      className="w-36 h-36 rounded-full object-cover border-2 border-gray-400"
                    />
                  </a>
                  <p className="mt-2 text-center text-sm text-gray-400 w-36">{track.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {results.albums.length > 0 && (
          <div className="results-section mb-8">
            <h2 className="text-center text-xl text-white font-bold mb-4">Albums</h2>
            <div className="flex justify-center gap-4">
              {results.albums.slice(0, 4).map((album, index) => (
                <div key={index} className="result-item text-center">
                  <a
                    href={`https://open.spotify.com/album/${album.id}`}
                  >
                    <img
                      src={album.images[0]?.url}
                      alt={album.name}
                      className="w-36 h-36 rounded-full object-cover border-2 border-gray-400"
                    />
                  </a>
                  <p className="mt-2 text-center text-sm text-gray-400 w-36">{album.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {results.playlists.length > 0 && (
          <div className="results-section mb-8">
            <h2 className="text-center text-xl text-white font-bold mb-4">Playlists</h2>
            <div className="flex justify-center gap-4">
              {results.playlists.slice(0, 4).map((playlist, index) => (
                <div key={index} className="result-item text-center">
                  <a
                    href={`https://open.spotify.com/playlist/${playlist.id}`}
                  >
                    <img
                      src={playlist.images[0]?.url}
                      alt={playlist.name}
                      className="w-36 h-36 rounded-full object-cover border-2 border-gray-400"
                    />
                  </a>
                  <p className="mt-2 text-center text-sm text-gray-400 w-36">{playlist.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
