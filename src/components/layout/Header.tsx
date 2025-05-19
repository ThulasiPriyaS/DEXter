import React from 'react';
import { Sun, Moon, Github, Menu, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { WalletConnect } from '../wallet/WalletConnect';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
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
              onClick={handleAuthClick}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {token ? 'Dashboard' : 'Sign In'}
            </Button>
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
            onClick={handleAuthClick}
            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {token ? 'Dashboard' : 'Sign In'}
          </Button>
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