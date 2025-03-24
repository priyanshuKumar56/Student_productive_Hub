"use client";

import AuthPage from "./components/auth/Login&reg";

import LandingPage from "./Pages/Landing_page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import FullDashboard from "./Pages/FullDashboard";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ProtectedRouteauth,
  ProtectedRoute,
} from "./components/auth/PrivateRoute";
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              <ProtectedRouteauth>
                <AuthPage />
              </ProtectedRouteauth>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                {" "}
                <div className="theme-container">
                  <FullDashboard />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
