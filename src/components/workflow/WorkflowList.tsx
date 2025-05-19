import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export const WorkflowList: React.FC = () => {
  const workflows = useWorkflowStore((state) => state.workflows);
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const setActiveWorkflow = useWorkflowStore((state) => state.setActiveWorkflow);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  if (workflows.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">My Workflows</h2>
        <div className="text-center py-6">
          <FileText size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">No workflows created yet.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Create your first workflow to get started.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">My Workflows</h2>
      <div className="space-y-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              workflow.id === activeWorkflowId
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent'
            }`}
            onClick={() => setActiveWorkflow(workflow.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-medium ${
                  workflow.id === activeWorkflowId
                    ? 'text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {workflow.name}
                </h3>
                
                {workflow.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {workflow.description.length > 50
                      ? `${workflow.description.slice(0, 50)}...`
                      : workflow.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={12} className="mr-1" />
                {formatDate(workflow.updatedAt)}
              </div>
            </div>
            
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span className="mr-3">{workflow.modules.length} modules</span>
              <span>{workflow.connections.length} connections</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};