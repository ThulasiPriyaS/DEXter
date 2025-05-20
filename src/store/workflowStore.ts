import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { ModuleData, ConnectionData, Workflow, Position } from '../types';

interface WorkflowState {
  activeWorkflowId: string | null;
  workflows: Workflow[];
  setActiveWorkflow: (id: string | null) => void;
  createWorkflow: (name: string, description: string) => void;
  updateWorkflowName: (id: string, name: string) => void;
  updateWorkflowDescription: (id: string, description: string) => void;
  deleteWorkflow: (id: string) => void;
  addModule: (workflowId: string, type: ModuleData['type'], position: Position) => string;
  updateModulePosition: (workflowId: string, moduleId: string, position: Position) => void;
  deleteModule: (workflowId: string, moduleId: string) => void;
  addConnection: (workflowId: string, sourceId: string, targetId: string) => string;
  removeConnection: (workflowId: string, connectionId: string) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      activeWorkflowId: null,
      workflows: [],
      
      setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
      
      createWorkflow: (name, description) => {
        const newWorkflow: Workflow = {
          id: nanoid(),
          name,
          description,
          modules: [],
          connections: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          workflows: [...state.workflows, newWorkflow],
          activeWorkflowId: newWorkflow.id,
        }));
      },
      
      updateWorkflowName: (id, name) => set((state) => ({
        workflows: state.workflows.map((workflow) => 
          workflow.id === id 
            ? { ...workflow, name, updatedAt: Date.now() } 
            : workflow
        ),
      })),
      
      updateWorkflowDescription: (id, description) => set((state) => ({
        workflows: state.workflows.map((workflow) => 
          workflow.id === id 
            ? { ...workflow, description, updatedAt: Date.now() } 
            : workflow
        ),
      })),
      
      deleteWorkflow: (id) => set((state) => ({
        workflows: state.workflows.filter((workflow) => workflow.id !== id),
        activeWorkflowId: state.activeWorkflowId === id ? null : state.activeWorkflowId,
      })),
      
      addModule: (workflowId, type, position) => {
        const moduleId = nanoid();
        set((state) => {
          const workflow = state.workflows.find((w) => w.id === workflowId);
          if (!workflow) return state;

          const newModule: ModuleData = {
            id: moduleId,
            type: type,
            label: type === 'startEndNode' ? 'Start' : type === 'conditionNode' ? 'Condition' : type.charAt(0).toUpperCase() + type.slice(1),
            position,
            subType: type === 'startEndNode' ? 'start' : undefined
          };

          return {
            workflows: state.workflows.map((w) =>
              w.id === workflowId
                ? {
                    ...w,
                    modules: [...w.modules, newModule],
                  }
                : w
            ),
          };
        });
        return moduleId;
      },
      
      updateModulePosition: (workflowId, moduleId, position) => set((state) => ({
        workflows: state.workflows.map((workflow) => 
          workflow.id === workflowId
            ? {
                ...workflow,
                modules: workflow.modules.map((module) => 
                  module.id === moduleId
                    ? { ...module, position }
                    : module
                ),
                updatedAt: Date.now(),
              }
            : workflow
        ),
      })),
      
      deleteModule: (workflowId, moduleId) => set((state) => ({
        workflows: state.workflows.map((workflow) => 
          workflow.id === workflowId
            ? {
                ...workflow,
                modules: workflow.modules.filter((module) => module.id !== moduleId),
                connections: workflow.connections.filter(
                  (connection) => 
                    connection.sourceId !== moduleId && connection.targetId !== moduleId
                ),
                updatedAt: Date.now(),
              }
            : workflow
        ),
      })),
      
      addConnection: (workflowId, sourceId, targetId) => {
        const connectionId = nanoid();
        
        set((state) => ({
          workflows: state.workflows.map((workflow) => 
            workflow.id === workflowId
              ? {
                  ...workflow,
                  connections: [
                    ...workflow.connections,
                    { id: connectionId, sourceId, targetId },
                  ],
                  updatedAt: Date.now(),
                }
              : workflow
          ),
        }));
        
        return connectionId;
      },
      
      removeConnection: (workflowId, connectionId) => set((state) => ({
        workflows: state.workflows.map((workflow) => 
          workflow.id === workflowId
            ? {
                ...workflow,
                connections: workflow.connections.filter(
                  (connection) => connection.id !== connectionId
                ),
                updatedAt: Date.now(),
              }
            : workflow
        ),
      })),
    }),
    {
      name: 'dex-workflowverse-workflows',
    }
  )
);