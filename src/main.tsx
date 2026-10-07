import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/layout.css'
import './styles/utilities.css'
import './styles/home.css'
import './styles/analyzer.css'
import './styles/results.css'
import './styles/how-it-works.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
