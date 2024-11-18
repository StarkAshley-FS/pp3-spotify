import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Your main app component
import './index.css'; // Your CSS file if needed

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
