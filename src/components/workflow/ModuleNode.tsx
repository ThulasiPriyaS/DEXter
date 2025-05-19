import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Trash2, ArrowRight, ArrowDownUp, PiggyBank, Trophy, ArrowLeftRight, Repeat } from 'lucide-react';
import { ModuleType, Position } from '../../types';
import { useWorkflowStore } from '../../store/workflowStore';

interface ModuleNodeProps {
  id: string;
  type: ModuleType;
  label: string;
  position: Position;
  workflowId: string;
  startConnection: (id: string, position: Position) => void;
  endConnection: (id: string) => void;
  isDraggingConnection: boolean;
}

export const ModuleNode: React.FC<ModuleNodeProps> = ({
  id,
  type,
  label,
  position,
  workflowId,
  startConnection,
  endConnection,
  isDraggingConnection,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const updateModulePosition = useWorkflowStore((state) => state.updateModulePosition);
  const removeModule = useWorkflowStore((state) => state.removeModule);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MODULE_NODE',
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const handleDragEnd = (e: React.DragEvent) => {
    if (!nodeRef.current) return;
    
    const nodeRect = nodeRef.current.getBoundingClientRect();
    const canvasRect = nodeRef.current.parentElement?.getBoundingClientRect();
    
    if (!canvasRect) return;
    
    const newPosition: Position = {
      x: e.clientX - canvasRect.left - nodeRect.width / 2,
      y: e.clientY - canvasRect.top - 20,
    };
    
    updateModulePosition(workflowId, id, newPosition);
  };
  
  const handleConnectionStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!nodeRef.current) return;
    
    const rect = nodeRef.current.getBoundingClientRect();
    const position: Position = {
      x: rect.right,
      y: rect.top + rect.height / 2,
    };
    
    startConnection(id, position);
  };
  
  const handleConnectionEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDraggingConnection) {
      endConnection(id);
    }
  };
  
  const renderIcon = () => {
    const iconSize = 20;
    const props = { size: iconSize };
    
    switch (type) {
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
  
  return (
    <div
      ref={(node) => {
        drag(node);
        nodeRef.current = node;
      }}
      className={`absolute w-[200px] select-none ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleConnectionEnd}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-md">
            {renderIcon()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
          </div>
          <button 
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              removeModule(workflowId, id);
            }}
            aria-label="Remove module"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {/* Connection point */}
      <div 
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-indigo-500 dark:bg-indigo-600 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-700 z-10 flex items-center justify-center"
        onClick={handleConnectionStart}
      >
        <ArrowRight size={12} className="text-white" />
      </div>
    </div>
  );
};