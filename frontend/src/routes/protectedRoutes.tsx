import { type ReactNode } from "react";
import { Navigate, type RouteProps } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token, user } = useAuth();

  // Check if both token and user exist
  const isValid = !!token && !!user;

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function PublicRoute({children}:RouteProps){
  const {isAuthenticated, isLoading, token, user} = useAuth();
  const isValid = !!token && !!user;
  if(isValid && isAuthenticated){
    return <Navigate to="/home" replace/>
  }
  return <>{children}</>;
}