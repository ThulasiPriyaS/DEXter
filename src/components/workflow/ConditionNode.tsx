import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ConditionNodeData {
  label: string;
  type: string;
  config?: Record<string, any>;
}

export const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 border-2 border-gray-300 rounded-md shadow-sm bg-yellow-50 min-w-[150px] relative">
      <div className="flex items-center gap-2">
        <div className="text-2xl">⚖️</div>
        <div>
          <div className="font-medium">{data.label || 'Condition'}</div>
          <div className="text-xs text-gray-500">Branch workflow</div>
        </div>
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      
      {/* True output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      {/* False output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  );
}; 