import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  connecting: boolean;
  token: string | null;
<<<<<<< HEAD
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setToken: (token: string) => void;
  clearError: () => void;
=======
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setToken: (token: string) => void;
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      address: null,
      balance: '0.00',
      connecting: false,
      token: null,
<<<<<<< HEAD
      error: null,

      connectWallet: async () => {
        set({ connecting: true, error: null });
        
        try {
          if (typeof window.ethereum === 'undefined') {
            throw new Error('Please install MetaMask to connect your wallet');
          }

          // Request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please unlock your MetaMask wallet.');
          }
          
          const address = accounts[0];
          const balance = await window.ethereum.request({ 
            method: 'eth_getBalance',
            params: [address, 'latest']
          });
          
          set({
            connected: true,
            address,
            balance: (parseInt(balance, 16) / 1e18).toFixed(4),
            connecting: false,
            error: null
          });

          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              // User disconnected their wallet
              set({
                connected: false,
                address: null,
                balance: '0.00',
                token: null
              });
            } else {
              // User switched accounts
              set({ address: newAccounts[0] });
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });

        } catch (error) {
          console.error('Failed to connect wallet:', error);
          set({ 
            connecting: false,
            error: error instanceof Error ? error.message : 'Failed to connect wallet'
          });
=======

      connectWallet: async () => {
        set({ connecting: true });
        
        try {
          // Simulate wallet connection with MetaMask
          if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            
            const address = accounts[0];
            const balance = await window.ethereum.request({ 
              method: 'eth_getBalance',
              params: [address, 'latest']
            });
            
            set({
              connected: true,
              address,
              balance: (parseInt(balance, 16) / 1e18).toFixed(4),
              connecting: false,
            });
          } else {
            throw new Error('Please install MetaMask');
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          set({ connecting: false });
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
        }
      },
      
      disconnectWallet: () => {
        set({
          connected: false,
          address: null,
          balance: '0.00',
          token: null,
<<<<<<< HEAD
          error: null
=======
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
        });
      },

      setToken: (token) => set({ token }),
<<<<<<< HEAD
      
      clearError: () => set({ error: null }),
=======
>>>>>>> d863bf59cdf1b560203882ab50b8d86e0ca5daad
    }),
    {
      name: 'dex-workflowverse-wallet',
    }
  )
);