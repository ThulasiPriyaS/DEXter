import React, { useCallback, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useWorkflowStore } from '../../store/workflowStore';
import { ModuleNode } from './ModuleNode';
import { ConnectionLine } from './ConnectionLine';
import { Position, ModuleType } from '../../types';

export const WorkflowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflows = useWorkflowStore((state) => state.workflows);
  const addModule = useWorkflowStore((state) => state.addModule);
  
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStartId, setConnectionStartId] = useState<string | null>(null);
  const [connectionEndPoint, setConnectionEndPoint] = useState<Position>({ x: 0, y: 0 });
  
  const activeWorkflow = workflows.find((workflow) => workflow.id === activeWorkflowId);
  
  const [, drop] = useDrop(() => ({
    accept: 'MODULE',
    drop: (item: { type: ModuleType }, monitor) => {
      if (!activeWorkflowId || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const offset = monitor.getClientOffset();
      
      if (!offset) return;
      
      const position: Position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
      };
      
      addModule(activeWorkflowId, item.type, position);
    },
  }));
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawingConnection || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setConnectionEndPoint({
      x: e.clientX - canvasRect.left,
      y: e.clientY - canvasRect.top,
    });
  }, [isDrawingConnection]);
  
  const startConnection = useCallback((moduleId: string, startPos: Position) => {
    setIsDrawingConnection(true);
    setConnectionStartId(moduleId);
    setConnectionEndPoint(startPos);
  }, []);
  
  const endConnection = useCallback((targetModuleId: string) => {
    if (!isDrawingConnection || !connectionStartId || !activeWorkflowId) return;
    
    // Prevent connecting a module to itself
    if (connectionStartId === targetModuleId) {
      setIsDrawingConnection(false);
      setConnectionStartId(null);
      return;
    }
    
    const addConnection = useWorkflowStore.getState().addConnection;
    addConnection(activeWorkflowId, connectionStartId, targetModuleId);
    
    setIsDrawingConnection(false);
    setConnectionStartId(null);
  }, [isDrawingConnection, connectionStartId, activeWorkflowId]);
  
  const cancelConnection = useCallback(() => {
    setIsDrawingConnection(false);
    setConnectionStartId(null);
  }, []);
  
  if (!activeWorkflow) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">No workflow selected</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new workflow or select an existing one</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="relative h-full w-full bg-gray-50 dark:bg-gray-900 overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={cancelConnection}
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] gap-4 p-4 pointer-events-none">
        {Array.from({ length: 40 }).map((_, x) =>
          Array.from({ length: 40 }).map((_, y) => (
            <div
              key={`${x}-${y}`}
              className="h-full w-full border border-dashed border-gray-200 dark:border-gray-800 rounded-sm opacity-30"
            />
          ))
        )}
      </div>
      
      {/* Connection lines */}
      {activeWorkflow.connections.map((connection) => {
        const sourceModule = activeWorkflow.modules.find((m) => m.id === connection.sourceId);
        const targetModule = activeWorkflow.modules.find((m) => m.id === connection.targetId);
        
        if (!sourceModule || !targetModule) return null;
        
        const sourcePosition: Position = {
          x: sourceModule.position.x + 100, // Adjust based on module width
          y: sourceModule.position.y + 40,  // Adjust based on module height
        };
        
        const targetPosition: Position = {
          x: targetModule.position.x,
          y: targetModule.position.y + 40,  // Adjust based on module height
        };
        
        return (
          <ConnectionLine
            key={connection.id}
            id={connection.id}
            source={sourcePosition}
            target={targetPosition}
            workflowId={activeWorkflow.id}
          />
        );
      })}
      
      {/* Drawing connection line */}
      {isDrawingConnection && connectionStartId && (
        <ConnectionLine
          id="drawing"
          source={
            (() => {
              const sourceModule = activeWorkflow.modules.find(
                (m) => m.id === connectionStartId
              );
              if (!sourceModule) return { x: 0, y: 0 };
              
              return {
                x: sourceModule.position.x + 100, // Adjust based on module width
                y: sourceModule.position.y + 40,  // Adjust based on module height
              };
            })()
          }
          target={connectionEndPoint}
          isDrawing
        />
      )}
      
      {/* Module nodes */}
      {activeWorkflow.modules.map((module) => (
        <ModuleNode
          key={module.id}
          id={module.id}
          type={module.type}
          label={module.label}
          position={module.position}
          workflowId={activeWorkflow.id}
          startConnection={startConnection}
          endConnection={endConnection}
          isDraggingConnection={isDrawingConnection}
        />
      ))}
    </div>
  );
};