import React from 'react';
import { Sun, Moon, Github, Menu, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { WalletConnect } from '../wallet/WalletConnect';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
            <a href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              Dashboard
            </a>
            <a href="/explore" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              Explore
            </a>
            <a href="/learn" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
              Learn
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <WalletConnect />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            
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
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <a 
            href="/dashboard" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dashboard
          </a>
          <a 
            href="/explore" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Explore
          </a>
          <a 
            href="/learn" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Learn
          </a>
        </div>
      )}
    </header>
  );
};