import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import 'react-dropzone-uploader/dist/styles.css';



ReactDOM.render(
  <ChakraProvider>
    <App/>
  </ChakraProvider>,
  document.getElementById('root')
);
