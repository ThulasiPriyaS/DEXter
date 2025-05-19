import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  connecting: boolean;
  token: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setToken: (token: string) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      connected: false,
      address: null,
      balance: '0.00',
      connecting: false,
      token: null,

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
        }
      },
      
      disconnectWallet: () => {
        set({
          connected: false,
          address: null,
          balance: '0.00',
          token: null,
        });
      },

      setToken: (token) => set({ token }),
    }),
    {
      name: 'dex-workflowverse-wallet',
    }
  )
);