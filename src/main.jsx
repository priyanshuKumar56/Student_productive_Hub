import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ReduxProvider } from "@/redux/provider";
// import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
// import { Toaster } from "@/components/ui/toaster";

import App from "./App.jsx";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReduxProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
