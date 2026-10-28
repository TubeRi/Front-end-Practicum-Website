import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AccountProvider } from './context/AccountContext';
import './index.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><AccountProvider><App /></AccountProvider></AuthProvider></BrowserRouter></React.StrictMode>);
