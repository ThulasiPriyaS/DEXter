import React, { useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Trash2, ArrowDownUp, PiggyBank, Trophy, ArrowLeftRight, Repeat, Settings, Play } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { ModuleData } from '../../types';
import { dexService } from '../../services/dexService';
import { toast } from 'sonner';
import { SwapInterface } from '../swap/SwapInterface';

export const ModuleNode: React.FC<NodeProps<ModuleData>> = ({ data, id }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSwapInterface, setShowSwapInterface] = useState(false);
  const { deleteModule } = useWorkflowStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const workflowId = useWorkflowStore.getState().activeWorkflowId;
    if (workflowId) {
      deleteModule(workflowId, id);
    }
  };

  const handleExecute = async () => {
    if (data.actionType === 'swap') {
      setShowSwapInterface(true);
    } else {
      toast.info('This action type is not yet implemented');
    }
  };

  const handleSwapComplete = () => {
    setShowSwapInterface(false);
    setIsExecuting(false);
  };

  const renderIcon = () => {
    const iconSize = 20;
    const props = { size: iconSize };
    
    switch (data.actionType) {
      case 'swap':
        return <ArrowDownUp {...props} className="text-indigo-600 dark:text-indigo-400" />;
      case 'stake':
        return <PiggyBank {...props} className="text-emerald-600 dark:text-emerald-400" />;
      case 'claim':
        return <Trophy {...props} className="text-amber-600 dark:text-amber-400" />;
      case 'bridge':
        return <ArrowLeftRight {...props} className="text-violet-600 dark:text-violet-400" />;
      case 'lend':
        return <Repeat {...props} className="text-cyan-600 dark:text-cyan-400" />;
      default:
        return null;
    }
  };

  const renderQuickInfo = () => {
    if (data.actionType !== 'swap') return null;
    const config = data.config || {};
    return (
      <div className="text-xs text-gray-500 mt-1">
        {config.tokenIn && config.tokenOut ? (
          <span>{config.amount || '1'} {config.tokenIn} → {config.tokenOut}</span>
        ) : (
          <span>Click configure to set up swap</span>
        )}
      </div>
    );
  };
  
  return (
    <>
      <div 
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 min-w-[200px] ${
          isExecuting ? 'border-yellow-500' : 
          'border-gray-200 dark:border-gray-700'
        }`}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span role="img" aria-label={data.label} className="text-lg">
                {renderIcon()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{data.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExecute();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Execute"
            >
              <Play className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {renderQuickInfo()}

        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      </div>

      {showSwapInterface && (
        <SwapInterface
          onClose={() => setShowSwapInterface(false)}
          onSwapComplete={handleSwapComplete}
        />
      )}
    </>
  );
};