import React from 'react';
import { Card } from '../ui/Card';

const NODE_TEMPLATES = [
  {
    type: 'startEndNode',
    subType: 'start',
    label: 'Start',
    description: 'Start point of the workflow',
    icon: '▶️',
  },
  {
    type: 'startEndNode',
    subType: 'end',
    label: 'End',
    description: 'End point of the workflow',
    icon: '⏹️',
  },
  {
    type: 'moduleNode',
    actionType: 'swap',
    label: 'Swap',
    description: 'Swap tokens on DEX',
    icon: '🔄',
  },
  {
    type: 'moduleNode',
    actionType: 'stake',
    label: 'Stake',
    description: 'Stake tokens for rewards',
    icon: '💰',
  },
  {
    type: 'moduleNode',
    actionType: 'claim',
    label: 'Claim',
    description: 'Claim rewards or tokens',
    icon: '🎁',
  },
  {
    type: 'moduleNode',
    actionType: 'bridge',
    label: 'Bridge',
    description: 'Bridge tokens between chains',
    icon: '🌉',
  },
  {
    type: 'moduleNode',
    actionType: 'lend',
    label: 'Lend',
    description: 'Lend tokens for interest',
    icon: '🏦',
  },
  {
    type: 'conditionNode',
    label: 'Condition',
    description: 'Add conditional logic',
    icon: '❓',
  },
  {
    type: 'exSatNode',
    subType: 'issueAsset',
    label: 'Issue Asset',
    description: 'Create a new asset on Bitcoin Layer',
    icon: '₿',
    exSatMetadata: {
      action: 'issueAsset',
      metadata: {
        name: 'NewAsset',
        supply: 1000000
      }
    }
  },
  {
    type: 'exSatNode',
    subType: 'swap',
    label: 'Swap Assets',
    description: 'Swap between Bitcoin Layer assets',
    icon: '₿',
    exSatMetadata: {
      action: 'swap',
      metadata: {
        fromAsset: 'BTC',
        toAsset: 'TokenX',
        amount: 1
      }
    }
  },
  {
    type: 'exSatNode',
    subType: 'claim',
    label: 'Claim Asset',
    description: 'Claim assets from Bitcoin Layer',
    icon: '₿',
    exSatMetadata: {
      action: 'claim',
      metadata: {
        claimId: 'claim_123',
        amount: 100
      }
    }
  }
];

const ModuleItem: React.FC<{ template: any }> = ({ template }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="cursor-move"
    >
      <Card className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center space-x-3">
          <span role="img" aria-label={template.label} className="text-xl">
            {template.icon}
          </span>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{template.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ModuleLibrary: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Module Library</h2>
      <div className="space-y-2">
        {NODE_TEMPLATES.map((template) => (
          <ModuleItem key={`${template.type}-${template.actionType || template.subType}`} template={template} />
        ))}
      </div>
    </div>
  );
};