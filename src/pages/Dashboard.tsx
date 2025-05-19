import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ModuleLibrary } from '../components/workflow/ModuleLibrary';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { WorkflowControls } from '../components/workflow/WorkflowControls';
import { WorkflowList } from '../components/workflow/WorkflowList';
import { useWorkflowStore } from '../store/workflowStore';

export const Dashboard: React.FC = () => {
  const createWorkflow = useWorkflowStore((state) => state.createWorkflow);
  const workflows = useWorkflowStore((state) => state.workflows);
  
  // Use touch backend for mobile devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
  
  // Create a default workflow if none exists
  useEffect(() => {
    if (workflows.length === 0) {
      createWorkflow('My First Workflow', 'A sample workflow to get started with DeFi operations');
    }
  }, [workflows.length, createWorkflow]);
  
  return (
    <DndProvider backend={dndBackend}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <WorkflowList />
            <ModuleLibrary />
          </div>
          
          <div className="lg:col-span-9 space-y-6">
            <WorkflowControls />
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-[500px]">
              <WorkflowCanvas />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};