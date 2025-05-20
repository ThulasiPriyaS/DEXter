import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  connecting: boolean;
  token: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setToken: (token: string) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      address: null,
      balance: '0.00',
      connecting: false,
      token: null,
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
        }
      },
      
      disconnectWallet: () => {
        set({
          connected: false,
          address: null,
          balance: '0.00',
          token: null,
          error: null
        });
      },

      setToken: (token) => set({ token }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dex-workflowverse-wallet',
    }
  )
);