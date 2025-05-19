export type ThemeMode = 'dark' | 'light';

export type Position = {
  x: number;
  y: number;
};

export type ModuleType = 'swap' | 'stake' | 'claim' | 'bridge' | 'lend';

export interface ModuleData {
  id: string;
  type: ModuleType;
  position: Position;
  label: string;
  icon: string;
}

export interface ConnectionData {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  modules: ModuleData[];
  connections: ConnectionData[];
  createdAt: number;
  updatedAt: number;
}