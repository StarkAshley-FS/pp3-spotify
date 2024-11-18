import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    console.log('Token:', token);
  
    if (token) {
      localStorage.setItem('spotifyToken', token);
      setTimeout(() => {
        navigate('/search');
      }, 100);
    } else {
      console.error('No token found in the URL');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
      <h1 className="text-xl font-semibold mb-2 text-gray-400">Please wait...</h1>
      <p className="text-xl font-semibold mb-2 text-gray-400">Redirecting you to the search page...</p>
    </div>
  );
};

export default LoginCallback;