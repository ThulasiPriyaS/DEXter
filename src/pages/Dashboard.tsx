import React, { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { WorkflowCanvasWithProvider } from '../components/workflow/WorkflowCanvas';
import { WorkflowControls } from '../components/workflow/WorkflowControls';
import { WorkflowList } from '../components/workflow/WorkflowList';
import { ModuleLibrary } from '../components/workflow/ModuleLibrary';
import { useWorkflowStore } from '../store/workflowStore';

export const Dashboard: React.FC = () => {
  const createWorkflow = useWorkflowStore((state) => state.createWorkflow);
  const workflows = useWorkflowStore((state) => state.workflows);
  
  // Create a default workflow if none exists
  useEffect(() => {
    if (workflows.length === 0) {
      createWorkflow('My First Workflow', 'A sample workflow to get started with DeFi operations');
    }
  }, [workflows.length, createWorkflow]);
  
  return (
    <ReactFlowProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <WorkflowList />
            <ModuleLibrary />
          </div>
          
          <div className="lg:col-span-9 space-y-6">
            <WorkflowControls />
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-[500px]">
              <WorkflowCanvasWithProvider />
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};