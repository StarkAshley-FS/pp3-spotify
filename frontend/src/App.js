import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LoginCallback from './pages/LoginCallback';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<LoginCallback />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;

