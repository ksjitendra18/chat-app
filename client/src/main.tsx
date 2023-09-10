import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { ModalProvider } from "./components/ModalProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ModalProvider />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
