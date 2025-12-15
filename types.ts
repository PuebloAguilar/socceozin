
export type MetaStatus = 'on_track' | 'at_risk' | 'off_track';
export type AreaType = 'management' | 'marketing' | 'sales' | 'product' | 'tech';

export interface KeyResult {
  id: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  weight: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dependencyId?: string; // ID of the prerequisite KR
}

export interface Meta {
  id: string;
  area: AreaType;
  objective: string;
  cycle: string;
  owner: { name: string; avatar: string };
  keyResults: KeyResult[];
}
