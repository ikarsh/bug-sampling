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

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Location = Coordinates | 'N/A';

export interface SamplingSetup {
  date: Date;
  location: Location;  // Now can be either coordinates or 'N/A'
  site: Site;
  type: SamplingType;
  samplingLength: number;
}

export type Site = 'site1' | 'site2' | 'site3' | 'site4' | 'site5' | 'site6';
export type SamplingType = 'type1' | 'type2' | 'type3';

export const SITES: Site[] = ['site1', 'site2', 'site3', 'site4', 'site5', 'site6'];
export const SAMPLING_TYPES: SamplingType[] = ['type1', 'type2', 'type3'];