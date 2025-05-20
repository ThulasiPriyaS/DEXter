import React, { useState, useEffect } from 'react';
import { ModuleData } from '../../types';
import { dexService } from '../../services/dexService';
import { toast } from 'sonner';

interface NodeConfigPanelProps {
  node: ModuleData;
  onClose: () => void;
  onUpdate: (nodeId: string, config: any) => void;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  node,
  onClose,
  onUpdate,
}) => {
  const [amount, setAmount] = useState(node.config?.amount || '');
  const [tokenIn, setTokenIn] = useState(node.config?.tokenIn || '');
  const [tokenOut, setTokenOut] = useState(node.config?.tokenOut || '');
  const [slippage, setSlippage] = useState(node.config?.slippage || 0.5);
  const [balances, setBalances] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      if (node.actionType === 'swap') {
        try {
          const address = await dexService.connectWallet();
          const testTokens = dexService.getTestTokens();
          const balances = await Promise.all(
            Object.entries(testTokens).map(async ([symbol, tokenAddress]) => {
              const balance = await dexService.getTokenBalance(tokenAddress, address);
              return [symbol, balance];
            })
          );
          setBalances(Object.fromEntries(balances));
        } catch (error) {
          console.error('Error fetching balances:', error);
        }
      }
    };

    fetchBalances();
  }, [node.actionType]);

  const handleSave = () => {
    const config = {
      amount,
      tokenIn,
      tokenOut,
      slippage,
    };
    onUpdate(node.id, config);
    toast.success('Configuration saved');
    onClose();
  };

  if (node.actionType !== 'swap') {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Node Configuration</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Configuration not available for this node type.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Swap Configuration</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token In
          </label>
          <select
            value={tokenIn}
            onChange={(e) => setTokenIn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select token</option>
            <option value="DAI">DAI</option>
            <option value="USDC">USDC</option>
          </select>
          {tokenIn && balances[tokenIn] && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Balance: {balances[tokenIn]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token Out
          </label>
          <select
            value={tokenOut}
            onChange={(e) => setTokenOut(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select token</option>
            <option value="DAI">DAI</option>
            <option value="USDC">USDC</option>
          </select>
          {tokenOut && balances[tokenOut] && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Balance: {balances[tokenOut]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Slippage Tolerance (%)
          </label>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            min="0.1"
            max="100"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}; 