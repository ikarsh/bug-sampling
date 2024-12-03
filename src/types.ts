// types.ts
export interface Bug {
  name: string;
  image: string;
}

export interface Session {
  duration: number;
  counts: number[];
  actions: number[];
}

export interface SubSession {
  wasRaining: boolean;
  counts: number[];
  actions: number[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Location = Coordinates | 'N/A';

export interface SamplingSetup {
  date: Date;
  location: Location;  // Now can be either coordinates or 'N/A'
  site: Site;
  treatment: SamplingType;
  samplingLength: number;
}

export type Site = 'site1' | 'site2' | 'site3' | 'site4' | 'site5' | 'site6';
export type SamplingType = 'Control' | 'High variety mix' | 'Low variety mix';

export const SITES: Site[] = ['site1', 'site2', 'site3', 'site4', 'site5', 'site6'];
export const TREATMENTS: SamplingType[] = ['Control', 'High variety mix', 'Low variety mix'];