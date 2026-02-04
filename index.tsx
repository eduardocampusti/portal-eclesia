
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render application:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red; font-family: sans-serif;">
      <h1>Erro ao Carregar o Sistema</h1>
      <p>Ocorreu um erro crítico durante a inicialização. Verifique o console do navegador para mais detalhes.</p>
      <pre style="background: #f4f4f4; padding: 10px;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
