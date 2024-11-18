import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../images/spotifylogo.png';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-[#1DB954] flex items-center justify-between px-6 py-4">
      <div className="flex-shrink-0">
        <Link to="/">
          <img src={Logo} alt="Spotify Logo" className="h-10" />
        </Link>
      </div>

      {isLoggedIn && (
        <form
          onSubmit={handleSearchSubmit}
          className="flex-grow flex justify-center"
        >
          <div className="relative w-3/5">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for artist..."
              className="w-full px-4 py-2 rounded-full bg-white text-black outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      )}

      {isLoggedIn && (
        <div className="flex-shrink-0">
          <button
            onClick={handleLogout}
            className="bg-gray-950 text-white px-4 py-2 rounded-full hover:bg-black"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
