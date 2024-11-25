import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ajout d'un console.log pour debug
console.log('Application starting...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
