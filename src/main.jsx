import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <App />
      </CartProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
