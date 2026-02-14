/** React imports */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/** Styles */
import './index.css'

/** Local Imports */
import App from './App.jsx'

/** React App Entry Point */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)