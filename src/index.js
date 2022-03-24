import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { HashRouter } from 'react-router-dom';
import { AlertContextProvider } from './Context/AlertContext';
import Alert from './Components/PopOvers/AlertDialog';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <HashRouter>
      <AlertContextProvider>
        <Alert />
        <App />
      </AlertContextProvider>
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);