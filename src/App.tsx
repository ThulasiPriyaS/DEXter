import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { useWalletStore } from './store/walletStore';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Workflows } from './pages/Workflows';
<<<<<<< HEAD
=======
import { Auth } from './pages/Auth';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useWalletStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/auth" />;
};
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad

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
<<<<<<< HEAD
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workflows" element={<Workflows />} />
=======
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
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;