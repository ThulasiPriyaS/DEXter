import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Position } from '../../types';

interface ConnectionLineProps {
  id: string;
  source: Position;
  target: Position;
  workflowId?: string;
  isDrawing?: boolean;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  id,
  source,
  target,
  workflowId,
  isDrawing = false,
}) => {
  const removeConnection = useWorkflowStore((state) => state.removeConnection);
  
  // Calculate control points for a bezier curve
  const getControlPoints = () => {
    const deltaX = target.x - source.x;
    
    const cp1 = {
      x: source.x + deltaX * 0.4,
      y: source.y,
    };
    
    const cp2 = {
      x: target.x - deltaX * 0.4,
      y: target.y,
    };
    
    return { cp1, cp2 };
  };
  
  const { cp1, cp2 } = getControlPoints();
  
  // Path for the curve
  const path = `M ${source.x} ${source.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${target.x} ${target.y}`;
  
  // Handle removal of connection
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDrawing || !workflowId) return;
    
    removeConnection(workflowId, id);
  };
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth="6"
          markerHeight="4"
          refX="6"
          refY="2"
          orient="auto"
        >
          <polygon
            points="0 0, 6 2, 0 4"
            fill={isDrawing ? "#9333EA" : "#6366F1"}
            className="transition-colors"
          />
        </marker>
      </defs>
      
      {/* Connection path */}
      <path
        d={path}
        fill="none"
        stroke={isDrawing ? "#9333EA" : "#6366F1"}
        strokeWidth="2"
        strokeDasharray={isDrawing ? "5,5" : "none"}
        className="transition-colors"
        markerEnd={`url(#arrowhead-${id})`}
      />
      
      {/* Invisible wider path for easier clicking */}
      {!isDrawing && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="12"
          className="cursor-pointer pointer-events-auto"
          onClick={handleRemove}
        />
      )}
    </svg>
  );
};