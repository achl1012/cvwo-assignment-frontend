import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
