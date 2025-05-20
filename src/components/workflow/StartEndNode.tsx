import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '../ui/Card';
import { ModuleType } from '../../types';

interface StartEndNodeData {
  label: string;
  type: ModuleType;
  subType: 'start' | 'end';
}

export const StartEndNode: React.FC<NodeProps<StartEndNodeData>> = memo(({ data }) => {
  const isStart = data.subType === 'start';
  const bgColor = isStart ? 'bg-emerald-500' : 'bg-red-500';
  const icon = isStart ? '▶️' : '⏹️';
  const label = isStart ? 'Start' : 'End';

  return (
    <Card className="min-w-[180px]">
      <div className="flex items-center p-3">
        <div className={`flex-shrink-0 p-2 ${bgColor} rounded-lg text-white`}>
          <span role="img" aria-label={label} className="text-xl">
            {icon}
          </span>
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-800 dark:text-gray-100">{label}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isStart ? 'Workflow start point' : 'Workflow end point'}
          </p>
        </div>
      </div>
      {isStart && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800"
        />
      )}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800"
        />
      )}
    </Card>
  );
}); 