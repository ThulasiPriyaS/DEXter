import React, { useCallback, useRef, useState, useEffect, forwardRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  NodeTypes,
  useReactFlow,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { ModuleNode } from './ModuleNode';
import { ConditionNode } from './ConditionNode';
import { StartEndNode } from './StartEndNode';
import { ModuleType, ModuleData } from '../../types';
import { WorkflowControls } from './WorkflowControls';
import { ModuleLibrary } from './ModuleLibrary';
import ExSatNode from './ExSatNode';
import { toast } from 'sonner';
import { NodeConfigPanel } from './NodeConfigPanel';

// Node type definitions
const nodeTypes: NodeTypes = {
  moduleNode: ModuleNode,
  conditionNode: ConditionNode,
  startEndNode: StartEndNode,
  exSatNode: ExSatNode
};

interface WorkflowCanvasProps {
  initialNodes?: Node<ModuleData>[];
  initialEdges?: Edge[];
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflows = useWorkflowStore((state) => state.workflows);
  const activeWorkflow = workflows.find((workflow) => workflow.id === activeWorkflowId);
  const addModule = useWorkflowStore((state) => state.addModule);
  const updateModulePosition = useWorkflowStore((state) => state.updateModulePosition);
  const addConnection = useWorkflowStore((state) => state.addConnection);
  const deleteModule = useWorkflowStore((state) => state.deleteModule);
  const reactFlowInstance = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState<ModuleData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<ModuleData> | null>(null);
  const { getNode } = useReactFlow();
  
  // Handle connections between nodes
  const onConnect = useCallback((params: Connection) => {
    if (!activeWorkflowId) return;
    
    const newEdge = {
      ...params,
      id: `e-${Math.random().toString(36).substr(2, 9)}`,
      animated: true,
      style: { strokeWidth: 2 },
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    addConnection(activeWorkflowId, params.source!, params.target!);
    
    // Log the new connection for debugging
    console.log('Added new connection:', newEdge);
    console.log('Current edges:', edges);
  }, [activeWorkflowId, addConnection, setEdges, edges]);
  
  // Handle dropping nodes onto canvas
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (typeof data === 'undefined' || !data) {
        return;
      }

      try {
        const nodeData = JSON.parse(data);
        const position = reactFlowInstance.project({
          x: event.clientX - (reactFlowBounds?.left || 0),
          y: event.clientY - (reactFlowBounds?.top || 0),
        });

        // Check if we're trying to add a start or end node
        if (nodeData.type === 'startEndNode') {
          const existingNode = nodes.find(
            (node) => node.type === 'startEndNode' && node.data?.subType === nodeData.subType
          );
          if (existingNode) {
            console.log(`Only one ${nodeData.subType} node is allowed`);
            return;
          }
        }

        if (!activeWorkflowId) return;
        // Add the module to the workflow store
        const moduleId = addModule(activeWorkflowId, nodeData.type as ModuleType, position);
        
        // Add the node to ReactFlow
        const newNode = {
          id: moduleId,
          type: nodeData.type,
          position,
          data: {
            ...nodeData,
            id: moduleId,
          },
        };

        console.log('Adding new node:', newNode);
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error adding node:', error);
      }
    },
    [reactFlowInstance, nodes, addModule, activeWorkflowId]
  );
  
  // Handle node position updates
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (!activeWorkflowId) return;
    updateModulePosition(activeWorkflowId, node.id, node.position);
  }, [activeWorkflowId, updateModulePosition]);

  // Handle node deletion
  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    if (!activeWorkflowId) return;
    
    nodesToDelete.forEach(node => {
      // Remove the node from our workflow store
      deleteModule(activeWorkflowId, node.id);
    });
  }, [activeWorkflowId, deleteModule]);

  // Add debug logging for node changes
  useEffect(() => {
    console.log('Nodes updated:', nodes);
    console.log('Edges updated:', edges);
  }, [nodes, edges]);

  const handleExecute = useCallback(async (workflowData: any) => {
    if (!activeWorkflowId) return;

    try {
      // Check for exSat nodes and prepare metadata
      const exSatNodes = workflowData.nodes.filter((node: Node) => node.type === 'exSatNode');
      if (exSatNodes.length > 0) {
        const exSatMetadata = exSatNodes.map((node: Node) => ({
          nodeId: node.id,
          ...node.data.exSatMetadata
        }));
        
        console.log('exSat Metadata:', exSatMetadata);
        toast.info('Workflow contains exSat operations', {
          description: 'This workflow can be executed on the Bitcoin Layer',
          duration: 5000,
        });
      }

      const response = await fetch(`/api/workflows/${activeWorkflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute workflow');
      }

      const result = await response.json();
      console.log('Workflow execution result:', result);
      
      return result;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }, [activeWorkflowId]);
  
  // Add programmatic execution method
  const executeWorkflowProgrammatically = useCallback(async () => {
    if (!activeWorkflowId) {
      console.error('No active workflow selected');
      return;
    }

    try {
      console.log('=== Programmatic Workflow Execution ===');
      const workflowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      };

      console.log('Executing workflow with data:', workflowData);
      await handleExecute(workflowData);
    } catch (error) {
      console.error('Programmatic execution failed:', error);
      throw error;
    }
  }, [activeWorkflowId, nodes, edges, handleExecute]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<ModuleData>) => {
    setSelectedNode(node);
  }, []);

  const handleNodeConfigUpdate = useCallback((nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  if (!activeWorkflow) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Select or create a workflow to begin</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative">
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange as OnNodesChange}
          onEdgesChange={onEdgesChange as OnEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onNodesDelete={onNodesDelete}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          connectionMode={ConnectionMode.Loose}
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'moduleNode':
                  return '#4f46e5'; // indigo-600
                case 'startEndNode':
                  return node.data.subType === 'start' ? '#059669' : '#dc2626'; // emerald-600 or red-600
                case 'conditionNode':
                  return '#7c3aed'; // violet-600
                case 'exSatNode':
                  return '#f59e0b'; // amber-500
                default:
                  return '#6b7280'; // gray-500
              }
            }}
            nodeStrokeWidth={3}
            nodeStrokeColor="#ffffff"
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
            }}
          />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="absolute right-4 top-4 w-80">
          <NodeConfigPanel
            node={selectedNode.data}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleNodeConfigUpdate}
          />
        </div>
      )}
    </div>
  );
};

// Wrap the component with ReactFlowProvider
export const WorkflowCanvasWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);