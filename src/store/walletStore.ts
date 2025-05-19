import { create } from 'zustand';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  connected: false,
  address: null,
  balance: '0.00',
  connecting: false,

  connectWallet: async () => {
    set({ connecting: true });
    
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock wallet address and balance
    set({
      connected: true,
      address: '0x' + Math.random().toString(16).slice(2, 12),
      balance: (Math.random() * 10).toFixed(4),
      connecting: false,
    });
  },
  
  disconnectWallet: () => {
    set({
      connected: false,
      address: null,
      balance: '0.00',
    });
  },
}));