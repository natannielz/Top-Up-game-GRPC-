import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

import { QueryClient, QueryClientProvider } from 'react-query'

// Suppress benign console errors from browser extensions (e.g., Google Translate)
// Suppress benign console errors from browser extensions (e.g., Google Translate)
// This error is caused by the extension injecting invalid SVG paths
const suppressList = [
  '<path> attribute d: Expected number',
  'tc0.2,0,0.4-0.2,0'
];

const shouldSuppress = (msg) => {
  if (!msg) return false;
  const str = String(msg);
  return suppressList.some(term => str.includes(term));
};

const originalConsoleError = console.error;
console.error = (...args) => {
  if (shouldSuppress(args[0])) return;
  originalConsoleError(...args);
};

window.onerror = (msg, source, lineno, colno, error) => {
  if (shouldSuppress(msg) || shouldSuppress(error)) return true; // true prevents default handling
};

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
