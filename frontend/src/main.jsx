import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RentalBagProvider } from "./context/RentalBagContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RentalBagProvider>
            <App />
          </RentalBagProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);