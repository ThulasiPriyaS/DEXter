import React from 'react';
import { Handle, Position } from 'reactflow';
import { ModuleData, ExSatMetadata } from '../../types';
import { toast } from 'sonner';

interface ExSatNodeProps {
  data: ModuleData;
}

const ExSatNode: React.FC<ExSatNodeProps> = ({ data }) => {
  const handleExSatAction = () => {
    if (data.exSatMetadata) {
      toast.success('This metadata can be submitted to exSat for consensus on the Bitcoin Layer', {
        duration: 5000,
      });
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-blue-500 min-w-[200px]"
      onClick={handleExSatAction}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-300 text-lg">₿</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{data.label}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data.description}</p>
        </div>
      </div>

      {data.exSatMetadata && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data.exSatMetadata, null, 2)}
          </pre>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ExSatNode; 