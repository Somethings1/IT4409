
import './index.css'
import App from './App.js'


import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './components/introduce/AuthContext.js';
import { BrowserRouter as Router } from 'react-router-dom';
import  {LoadingProvider} from  './components/introduce/Loading.js'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router>
    <LoadingProvider >
      <AuthProvider>
        <App />
      </AuthProvider>
       
    </LoadingProvider>
    </Router>
  //  </React.StrictMode>
);


