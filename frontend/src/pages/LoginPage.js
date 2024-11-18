import React from 'react';
import Logo from '../images/spotifylogogreen.png';

const LoginPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    window.location.href = `${apiUrl}/api/login`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
      <img src={Logo} alt="Spotify Logo" className="h-16 mb-4" />
      <h1 className="text-xl text-white font-semibold mb-2">Please login</h1>
      <h3 className="text-md text-gray-400 mb-4"> In order to search for artists, tracks, albums, and playlists, you must login to your spotify account</h3>
      <button
        onClick={handleLogin}
        className="bg-[#1DB954] text-white px-4 py-2 rounded-full"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default LoginPage;
