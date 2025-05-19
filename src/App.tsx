import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useWalletStore } from './store/walletStore';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Workflows } from './pages/Workflows';
import { Auth } from './pages/Auth';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useWalletStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  const { mode } = useThemeStore();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <BrowserRouter>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflows"
              element={
                <ProtectedRoute>
                  <Workflows />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;