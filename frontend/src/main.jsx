import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from './context/ChatProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
)
