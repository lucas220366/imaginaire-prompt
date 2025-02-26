
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  // Check if there's an access token or recovery token in the URL
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const searchParams = new URLSearchParams(window.location.search);
  const isAuthFlow = hashParams.has('access_token') || 
                     searchParams.has('token') || 
                     hashParams.get('type') === 'recovery' ||
                     searchParams.get('type') === 'recovery';

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Routes>
              <Route 
                path="/" 
                element={
                  isAuthFlow ? (
                    <Navigate to="/auth" replace state={{ from: window.location.href }} />
                  ) : (
                    <Index />
                  )
                } 
              />
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

