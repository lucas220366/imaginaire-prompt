
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from './pages/Auth';
import Index from './pages/Index';
import Profile from './pages/Profile';
import ImageGenerator from './components/ImageGenerator';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's an access token or recovery token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    const isAuthFlow = hashParams.has('access_token') || 
                      searchParams.has('token') || 
                      hashParams.get('type') === 'recovery' ||
                      searchParams.get('type') === 'recovery';

    if (isAuthFlow) {
      console.log("Redirecting to auth with hash:", window.location.hash);
      navigate('/auth', { 
        replace: true,
        state: { from: window.location.href }
      });
    }
  }, [navigate, location]);

  return null;
}

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AuthRedirect />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/generator" 
                element={
                  <ProtectedRoute>
                    <ImageGenerator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
