import React from 'react';
import { Sun, Moon, Menu, X, Wallet } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD

export const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const { connected, connecting, error, connectWallet, disconnectWallet, clearError } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    if (connected) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
=======
import { useWalletStore } from '../../store/walletStore';

export const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const { token } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                DW
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 hidden sm:block">
                DEX WorkflowVerse
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
<<<<<<< HEAD
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Dashboard
            </Button>
            <div className="relative">
              <Button
                variant={connected ? "secondary" : "primary"}
                onClick={handleWalletConnect}
                leftIcon={<Wallet size={16} />}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : connected ? 'Connected' : 'Connect Wallet'}
              </Button>
              {error && (
                <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-md shadow-lg border border-red-200 dark:border-red-800">
                  {error}
                  <button 
                    onClick={clearError}
                    className="absolute top-1 right-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
=======
              onClick={handleAuthClick}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {token ? 'Dashboard' : 'Sign In'}
            </Button>
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <Button
            variant="ghost"
            fullWidth
<<<<<<< HEAD
            onClick={() => navigate('/dashboard')}
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dashboard
          </Button>
          <div className="relative">
            <Button
              variant={connected ? "secondary" : "primary"}
              fullWidth
              onClick={handleWalletConnect}
              leftIcon={<Wallet size={16} />}
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : connected ? 'Connected' : 'Connect Wallet'}
            </Button>
            {error && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                {error}
                <button 
                  onClick={clearError}
                  className="absolute top-1 right-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
=======
            onClick={handleAuthClick}
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {token ? 'Dashboard' : 'Sign In'}
          </Button>
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
          <Button
            variant="ghost"
            fullWidth
            onClick={toggleTheme}
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>
      )}
    </header>
  );
};