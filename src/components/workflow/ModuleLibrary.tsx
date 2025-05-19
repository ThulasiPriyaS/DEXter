import React from 'react';
import { useDrag } from 'react-dnd';
import { Repeat, ArrowDownUp, Trophy, ArrowLeftRight, PiggyBank } from 'lucide-react';
import { Card } from '../ui/Card';
import { ModuleType } from '../../types';

interface ModuleItemProps {
  type: ModuleType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ type, label, description, icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MODULE',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-grab ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <Card 
        variant="bordered"
        hoverable
        className="transition-all duration-200"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ModuleLibrary: React.FC = () => {
  const modules = [
    {
      type: 'swap' as ModuleType,
      label: 'Swap Tokens',
      description: 'Exchange one token for another',
      icon: <ArrowDownUp size={24} className="text-indigo-600 dark:text-indigo-400" />,
    },
    {
      type: 'stake' as ModuleType,
      label: 'Stake Assets',
      description: 'Stake assets to earn rewards',
      icon: <PiggyBank size={24} className="text-emerald-600 dark:text-emerald-400" />,
    },
    {
      type: 'claim' as ModuleType,
      label: 'Claim Rewards',
      description: 'Claim earnings from staked assets',
      icon: <Trophy size={24} className="text-amber-600 dark:text-amber-400" />,
    },
    {
      type: 'bridge' as ModuleType,
      label: 'Bridge Assets',
      description: 'Transfer assets between chains',
      icon: <ArrowLeftRight size={24} className="text-violet-600 dark:text-violet-400" />,
    },
    {
      type: 'lend' as ModuleType,
      label: 'Lend Assets',
      description: 'Provide liquidity to earn interest',
      icon: <Repeat size={24} className="text-cyan-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Module Library</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Drag modules to the canvas to build your workflow
      </p>
      <div className="space-y-3">
        {modules.map((module) => (
          <ModuleItem
            key={module.type}
            type={module.type}
            label={module.label}
            description={module.description}
            icon={module.icon}
          />
        ))}
      </div>
    </div>
  );
};