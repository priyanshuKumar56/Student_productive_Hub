import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const ProtectedRouteauth = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/Dashboard" />;
};
export { ProtectedRoute, ProtectedRouteauth };
