import React, { useState, useEffect } from 'react';
import { ArrowDownUp, Wallet, ChevronDown, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Token {
  symbol: string;
  balance: string;
  address: string;
}

interface PoolInfo {
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
  ratio: string;
  fee: string;
  slippage: string;
  tvl: string;
}

const mockWallet = {
  address: '0x1234...5678',
  tokens: [
    { symbol: 'ETH', balance: '2.5', address: '0x...' },
    { symbol: 'USDC', balance: '5000', address: '0x...' },
  ] as Token[],
};

const mockPool: PoolInfo = {
  tokenA: 'ETH',
  tokenB: 'USDC',
  reserveA: 100,
  reserveB: 180000,
  ratio: '35% ETH / 65% USDC',
  fee: '0.3%',
  slippage: '0.2%',
  tvl: '$299,000',
};

interface SwapInterfaceProps {
  onClose: () => void;
  onSwapComplete?: () => void;
}

export const SwapInterface: React.FC<SwapInterfaceProps> = ({ onClose, onSwapComplete }) => {
  const [fromToken, setFromToken] = useState<Token>(mockWallet.tokens[0]);
  const [toToken, setToToken] = useState<Token>(mockWallet.tokens[1]);
  const [amount, setAmount] = useState<string>('1');
  const [showSwapFlow, setShowSwapFlow] = useState(false);
  const [swapStep, setSwapStep] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const estimatedOutput = (Number(amount) * mockPool.reserveB / mockPool.reserveA).toFixed(2);

  // Effect to handle canvas resizing, controls visibility, and panel display
  useEffect(() => {
    const canvas = document.querySelector('.react-flow');
    const controls = document.querySelector('.workflow-controls');
    const swapPanel = document.querySelector('.swap-interface-panel') as HTMLElement;
    const liquidityPanel = document.querySelector('.liquidity-pool-panel') as HTMLElement;

    if (canvas) {
      canvas.classList.add('canvas-shrink');
    }
    
    // Hide workflow controls
    if (controls) {
      controls.classList.add('hidden');
    }

    // Show panels
    if (swapPanel) {
        swapPanel.style.display = 'flex';
    }
    if (liquidityPanel) {
        liquidityPanel.style.display = 'flex';
    }

    return () => {
      if (canvas) {
        canvas.classList.remove('canvas-shrink');
      }
      if (controls) {
        controls.classList.remove('hidden');
      }
      // Hide panels on close
      if (swapPanel) {
          swapPanel.style.display = 'none';
      }
      if (liquidityPanel) {
          liquidityPanel.style.display = 'none';
      }
    };
  }, []);

  const handleSwap = async () => {
    setIsSwapping(true);
    setShowSwapFlow(true);
    
    // Simulate swap steps
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSwapStep(i + 1);
    }
    
    setShowConfirmation(true);
    setIsSwapping(false);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    
    // Update mock wallet balances
    mockWallet.tokens[0].balance = (Number(mockWallet.tokens[0].balance) - Number(amount)).toFixed(2);
    mockWallet.tokens[1].balance = (Number(mockWallet.tokens[1].balance) + Number(estimatedOutput)).toFixed(2);
    
    // Update pool reserves
    mockPool.reserveA += Number(amount);
    mockPool.reserveB -= Number(estimatedOutput);
    mockPool.ratio = `${Math.round((mockPool.reserveA / (mockPool.reserveA + mockPool.reserveB)) * 100)}% ETH / ${Math.round((mockPool.reserveB / (mockPool.reserveA + mockPool.reserveB)) * 100)}% USDC`;
    
    toast.success('Swap completed successfully!');
    if (onSwapComplete) {
      onSwapComplete();
    }
  };

  return (
    <>
      {/* The canvas and main layout are handled by the parent component.
          This component renders the fixed right panels and modals. */}
      
      {/* Swap Configuration Panel */}
      <div className="swap-interface-panel">
        {/* Header */}
        <div className="swap-interface-header flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Swap Configuration</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="swap-interface-content">
          {/* Wallet Info */}
          <div className="swap-interface-section">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-indigo-600" />
              <span className="font-medium text-gray-900">{mockWallet.address}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mockWallet.tokens.map((token) => (
                <div key={token.symbol} className="text-sm">
                  <span className="text-gray-500">{token.symbol}:</span>
                  <span className="ml-2 font-medium text-gray-900">{token.balance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Swap Interface */}
          <div className="swap-interface-section">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="flex gap-2">
                  <select
                    value={fromToken.symbol}
                    onChange={(e) => setFromToken(mockWallet.tokens.find(t => t.symbol === e.target.value)!)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                  >
                    {mockWallet.tokens.map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                    placeholder="Amount"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDownUp className="text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <select
                  value={toToken.symbol}
                  onChange={(e) => setToToken(mockWallet.tokens.find(t => t.symbol === e.target.value)!)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                >
                  {mockWallet.tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwap}
                disabled={isSwapping}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSwapping ? 'Swapping...' : 'Swap'}
              </button>
            </div>
          </div>
        </div>

        {/* Liquidity Pool Panel */}
        <div className="liquidity-pool-panel">
          <div className="liquidity-pool-header">
            <ArrowDownUp className="w-5 h-5 text-indigo-600" />
            <span>Liquidity Pool</span>
          </div>

          <div className="liquidity-pool-content">
            <div className="liquidity-pool-grid">
              {/* Token Pair Card */}
              <div className="liquidity-pool-card">
                <div className="liquidity-pool-card-header">
                  <span>Token Pair</span>
                </div>
                <div className="liquidity-pool-card-content">
                  <div className="font-medium text-gray-900">{mockPool.tokenA}/{mockPool.tokenB}</div>
                  <div className="mt-1 text-sm">Ratio: {mockPool.ratio}</div>
                </div>
              </div>

              {/* Reserves Card */}
              <div className="liquidity-pool-card">
                <div className="liquidity-pool-card-header">
                  <span>Reserves</span>
                </div>
                <div className="liquidity-pool-card-content">
                  <div>{mockPool.tokenA}: {mockPool.reserveA}</div>
                  <div>{mockPool.tokenB}: {String(mockPool.reserveB.toLocaleString())}</div>
                </div>
              </div>

              {/* Fees & Slippage Card */}
              <div className="liquidity-pool-card">
                <div className="liquidity-pool-card-header">
                  <span>Fees & Slippage</span>
                </div>
                <div className="liquidity-pool-card-content">
                  <div>Fee: {mockPool.fee}</div>
                  <div>Slippage: {mockPool.slippage}</div>
                </div>
              </div>

              {/* TVL & Output Card */}
              <div className="liquidity-pool-card">
                <div className="liquidity-pool-card-header">
                  <span>TVL & Output</span>
                </div>
                <div className="liquidity-pool-card-content">
                  <div>TVL: {mockPool.tvl}</div>
                  <div className="mt-1">Est. Output: ~{estimatedOutput} {toToken.symbol}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showSwapFlow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Swap Progress</h3>
              <div className="space-y-4">
                <div className={`flex items-center ${swapStep >= 1 ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle2 className="mr-2" />
                  <span>Preparing transaction</span>
                </div>
                <div className={`flex items-center ${swapStep >= 2 ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle2 className="mr-2" />
                  <span>Executing swap</span>
                </div>
                <div className={`flex items-center ${swapStep >= 3 ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle2 className="mr-2" />
                  <span>Updating pool reserves</span>
                </div>
                <div className={`flex items-center ${swapStep >= 4 ? 'text-green-500' : 'text-gray-400'}`}>
                  <CheckCircle2 className="mr-2" />
                  <span>Completing transaction</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">✅ Swap Submitted!</h3>
              <div className="space-y-2 text-sm">
                <div>TX Hash: 0x123abc...</div>
                <div>Gas Used: 0.0021 ETH</div>
                <div>Network: Goerli Testnet</div>
                <div>Confirmed in 2.4s</div>
              </div>
              <button
                onClick={handleConfirm}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Confirm Swap
              </button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Swap Successful!</h3>
              <div className="space-y-2 text-sm">
                <div>You swapped {amount} {fromToken.symbol} → {estimatedOutput} {toToken.symbol}</div>
                <div className="mt-4">
                  <div>Updated Balances:</div>
                  <div>{fromToken.symbol}: {mockWallet.tokens[0].balance}</div>
                  <div>{toToken.symbol}: {mockWallet.tokens[1].balance}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }; 