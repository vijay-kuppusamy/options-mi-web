/** @format */
//Bootstrap
//import 'bootstrap/dist/js/bootstrap.bundle.js';
import './assets/css/tabler.css';
import './assets/css/tabler-vendors.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

//Third party
import { BrowserRouter } from 'react-router-dom';

//Project imports
import { store } from './store';
import './assets/css/main.css';
import './assets/js/main';
import './assets/js/theme';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
