import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { populateDayOneEfforts } from './data/dayOneData.ts';

// Auto-seed Day 1 Winter Arc efforts on first launch or if attempts are empty
try {
  const existingDsa = localStorage.getItem('career-os-dsa');
  if (!existingDsa || existingDsa.includes('"attempts":[]')) {
    populateDayOneEfforts();
  }
} catch (e) {
  console.warn('Auto-seed check error:', e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
