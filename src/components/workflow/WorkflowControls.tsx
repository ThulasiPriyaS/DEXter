import React, { useState } from 'react';
import { Play, Save, Plus, Trash } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Button } from '../ui/Button';
import { useWalletStore } from '../../store/walletStore';

export const WorkflowControls: React.FC = () => {
  const { connected } = useWalletStore();
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflows = useWorkflowStore((state) => state.workflows);
  const createWorkflow = useWorkflowStore((state) => state.createWorkflow);
  const deleteWorkflow = useWorkflowStore((state) => state.deleteWorkflow);
  
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'executing' | 'success' | 'error'>('idle');
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  
  const activeWorkflow = workflows.find((workflow) => workflow.id === activeWorkflowId);
  
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
  
  const handleExecuteWorkflow = async () => {
    if (!activeWorkflowId || !connected) return;
    
    setExecutionStatus('executing');
    
    try {
      // Simulate execution delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setExecutionStatus('success');
      
      // Reset status after showing success
      setTimeout(() => {
        setExecutionStatus('idle');
      }, 3000);
    } catch (error) {
      setExecutionStatus('error');
      
      // Reset status after showing error
      setTimeout(() => {
        setExecutionStatus('idle');
      }, 3000);
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
            <Button
              variant="outline"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateWorkflow}
              disabled={!newWorkflowName}
            >
              Create Workflow
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Workflow Controls</h2>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreating(true)}
            >
              New Workflow
            </Button>
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
                  <Button
                    variant="primary"
                    leftIcon={<Play size={16} />}
                    disabled={executionStatus !== 'idle' || !connected}
                    isLoading={executionStatus === 'executing'}
                    onClick={handleExecuteWorkflow}
                  >
                    {executionStatus === 'success'
                      ? 'Executed Successfully'
                      : executionStatus === 'error'
                      ? 'Execution Failed'
                      : 'Execute Workflow'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    leftIcon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDeleteWorkflow}
                  >
                    <Trash size={16} className="text-red-500" />
                  </Button>
                </div>
                
                {!connected && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Connect your wallet to execute this workflow
                  </p>
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
        </div>
      )}
    </div>
  );
};