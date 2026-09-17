import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { trackCampaignAttribution } from './analytics/trackCampaignAttribution';
import App from './App';
import './index.css';

trackCampaignAttribution();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
