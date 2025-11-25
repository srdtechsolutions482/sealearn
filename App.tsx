import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/Layout';
import PublicPages from './pages/PublicPages';
import AuthPages from './pages/AuthPages';
import DashboardPages from './pages/DashboardPages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Auth pages have their own layout and are not wrapped by MainLayout */}
          <Route path="/login" element={<AuthPages />} />
          <Route path="/register" element={<AuthPages />} />
          
          {/* Public and Dashboard pages use the MainLayout */}
          <Route element={<MainLayout />}>
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardPages />
                </ProtectedRoute>
              } 
            />
            {/* General public pages route, must be last to work as a catch-all */}
            <Route path="/*" element={<PublicPages />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;