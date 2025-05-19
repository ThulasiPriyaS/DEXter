import React from 'react';
import { Wallet, WalletCards } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../ui/Button';

export const WalletConnect: React.FC = () => {
  const { 
    connected, 
    address, 
    balance, 
    connecting,
    connectWallet, 
    disconnectWallet 
  } = useWalletStore();

  const [showMenu, setShowMenu] = React.useState(false);
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <div className="relative">
      {connected ? (
        <>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="border border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
            leftIcon={<WalletCards size={16} />}
          >
            {formatAddress(address || '')}
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Connected Address</div>
                  <div className="text-sm font-mono font-medium">{address}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Balance</div>
                  <div className="font-medium">{balance} BTC</div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    disconnectWallet();
                    setShowMenu(false);
                  }}
                >
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={connectWallet}
          isLoading={connecting}
          leftIcon={<Wallet size={16} />}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};