import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LeadsApp } from './leadsglobal/app/LeadsApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LeadsApp />
  </StrictMode>,
)
