import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initOnlineStorage } from './utils/onlineStorage.js'

// Initialize online storage sync before rendering the app to seed localStorage
initOnlineStorage()
  .catch((err) => console.error("[App] Online storage initialization error:", err))
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });

