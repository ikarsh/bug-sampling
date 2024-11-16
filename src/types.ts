// types.ts
export interface Bug {
  name: string;
  image: string;
}

export interface Session {
  name: string;
  duration: number;
  counts: number[];
  actions: number[];
}

export interface SamplingSetup {
  date: string;
  hour: string;
  location: string;
  site: Site;
  type: SamplingType;
  samplingLength: number;
}

export type Site = 'site1' | 'site2' | 'site3' | 'site4' | 'site5' | 'site6';
export type SamplingType = 'type1' | 'type2' | 'type3';

// Constants for the dropdown options
export const SITES: Site[] = ['site1', 'site2', 'site3', 'site4', 'site5', 'site6'];
export const SAMPLING_TYPES: SamplingType[] = ['type1', 'type2', 'type3'];