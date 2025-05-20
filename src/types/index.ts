export type ThemeMode = 'dark' | 'light';

export interface Position {
  x: number;
  y: number;
}

export type ModuleType = 
  | 'swap'
  | 'stake'
  | 'claim'
  | 'bridge'
  | 'lend'
  | 'exSatNode';

export interface ExSatMetadata {
  action: 'issueAsset' | 'swap' | 'claim';
  asset?: string;
  metadata: {
    name?: string;
    supply?: number;
    amount?: number;
    fromAsset?: string;
    toAsset?: string;
    claimId?: string;
  };
}

export interface ModuleData {
  id: string;
  type: string;
  label: string;
  description: string;
  actionType: 'swap' | 'stake' | 'claim' | 'bridge' | 'lend';
  position: { x: number; y: number };
  subType?: 'start' | 'end';
  config?: {
    amount?: string;
    tokenIn?: string;
    tokenOut?: string;
    slippage?: number;
  };
  exSatMetadata?: {
    action: string;
    metadata: Record<string, any>;
  };
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

// ReactFlow specific types
export interface NodeData {
  label: string;
  type: ModuleType;
  subType?: 'start' | 'end';
  config?: Record<string, any>;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}