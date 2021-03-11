import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Login/Login';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
