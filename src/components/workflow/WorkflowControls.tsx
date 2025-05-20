import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, Play } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWalletStore } from '../../store/walletStore';
import { useReactFlow, ReactFlowProvider } from 'reactflow';

interface WorkflowControlsProps {
  onExecute?: (workflow: any) => void;
}

const WorkflowControlsInner: React.FC<WorkflowControlsProps> = ({ onExecute }) => {
  const { connected } = useWalletStore();
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflows = useWorkflowStore((state) => state.workflows);
  const createWorkflow = useWorkflowStore((state) => state.createWorkflow);
  const deleteWorkflow = useWorkflowStore((state) => state.deleteWorkflow);
  
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'executing' | 'success' | 'error'>('idle');
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const activeWorkflow = workflows.find((workflow) => workflow.id === activeWorkflowId);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to execute workflow
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (connected && activeWorkflowId) {
          await handleExecute();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [connected, activeWorkflowId]);

  const validateWorkflowBasic = useCallback(() => {
    if (!activeWorkflow) return ['No active workflow'];
    
    const errors: string[] = [];

    // 1. Check if nodes exist
    if (activeWorkflow.modules.length === 0) {
      errors.push('Add at least one node to the workflow');
    }

    // 2. Check if nodes are connected
    const connectedNodeIds = new Set<string>();
    activeWorkflow.connections.forEach(connection => {
      connectedNodeIds.add(connection.sourceId);
      connectedNodeIds.add(connection.targetId);
    });

    const orphanedNodes = activeWorkflow.modules.filter(module => !connectedNodeIds.has(module.id));
    if (orphanedNodes.length > 0) {
      errors.push('All nodes must be connected');
    }

    // 3. Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = activeWorkflow.connections.filter(connection => connection.sourceId === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.targetId)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const module of activeWorkflow.modules) {
      if (hasCycle(module.id)) {
        errors.push('Workflow contains circular dependencies');
        break;
      }
    }

    return errors;
  }, [activeWorkflow]);

  const handleExecute = async () => {
    try {
      setError(null);
      setValidationError(null);

      if (!activeWorkflow) {
        setError('No active workflow');
        return;
      }

      console.log('=== Executing Workflow ===');
      console.log('Current Modules:', activeWorkflow.modules);
      console.log('Current Connections:', activeWorkflow.connections);

      // Validate workflow with basic checks
      const validationErrors = validateWorkflowBasic();
      if (validationErrors.length > 0) {
        console.log('Validation failed:', validationErrors);
        setValidationError(validationErrors.join('\n'));
        return;
      }
    
      setExecutionStatus('executing');
    
      // Prepare workflow data
      const workflowData = {
        id: activeWorkflowId,
        nodes: activeWorkflow.modules.map(module => ({
          id: module.id,
          type: module.type,
          data: module,
          position: module.position
        })),
        edges: activeWorkflow.connections.map(connection => ({
          id: connection.id,
          source: connection.sourceId,
          target: connection.targetId
        }))
      };

      // Log the workflow data
      console.log('Executing workflow:', workflowData);

      // Call the onExecute callback if provided
      if (onExecute) {
        await onExecute(workflowData);
      }

      setExecutionStatus('success');
      // Reset status after showing success
      setTimeout(() => {
        setExecutionStatus('idle');
      }, 3000);

    } catch (err) {
      console.error('Workflow execution error:', err);
      setError('Failed to execute workflow');
      setExecutionStatus('error');
      // Reset status after showing error
      setTimeout(() => {
        setExecutionStatus('idle');
        setError(null);
      }, 3000);
    }
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflowName) return;
    
    createWorkflow(newWorkflowName, newWorkflowDescription);
    setNewWorkflowName('');
    setNewWorkflowDescription('');
    setIsCreating(false);
  };
  
  const handleDeleteWorkflow = () => {
    if (!activeWorkflowId) return;
    
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(activeWorkflowId);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {isCreating ? (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Create New Workflow</h2>
          
          <div>
            <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Workflow Name
            </label>
            <input
              type="text"
              id="workflow-name"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder="My Workflow"
            />
          </div>
          
          <div>
            <label htmlFor="workflow-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="workflow-description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={newWorkflowDescription}
              onChange={(e) => setNewWorkflowDescription(e.target.value)}
              placeholder="Optional description..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={handleCreateWorkflow}
              disabled={!newWorkflowName}
            >
              Create Workflow
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Workflow Controls</h2>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsCreating(true)}
            >
              New Workflow
            </button>
          </div>
          
          <div className="space-y-3">
            {activeWorkflow ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {activeWorkflow.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeWorkflow.description || 'No description'}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
                    onClick={handleExecute}
                    disabled={!connected || executionStatus === 'executing'}
                  >
                    <Play size={16} className="mr-2" />
                    Execute
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={handleDeleteWorkflow}
                  >
                    Delete Workflow
                  </button>
                </div>
                
                {!connected && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Connect your wallet to execute this workflow (Ctrl/Cmd + Enter)
                  </p>
                )}

                {validationError && (
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="whitespace-pre-line">{validationError}</div>
                  </div>
                )}

                {executionStatus === 'success' && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Workflow executed successfully!
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 dark:text-gray-400">
                  No workflow selected. Create a new one to get started.
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const WorkflowControls: React.FC<WorkflowControlsProps> = (props) => (
  <ReactFlowProvider>
    <WorkflowControlsInner {...props} />
  </ReactFlowProvider>
);