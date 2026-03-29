import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug logging
console.log('🚀 Plot Twist App Starting...');
console.log('Environment check:', {
  supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  anthropicKey: !!import.meta.env.ANTHROPIC_API_KEY,
  nodeEnv: import.meta.env.MODE
});

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ App render failed:', error);
  // Fallback UI
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; background: #1f2937; color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center;">
        <h1 style="color: #ef4444; margin-bottom: 20px;">App Failed to Load</h1>
        <p style="margin-bottom: 10px;">Check the browser console for error details.</p>
        <p style="font-size: 14px; color: #9ca3af;">Error: ${error.message}</p>
      </div>
    </div>
  `;
}