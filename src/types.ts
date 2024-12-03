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
  treatment: Treatment;
  samplingLength: number;
}

export const SITES = ['Revadim North', 'Revadim East', 'Revadim South', 'Galon East', 'Galon West', 'Mishmar Hanegev'];
export const TREATMENTS = ['Control', 'High variety mix', 'Low variety mix'];

export type Site = typeof SITES[number];
export type Treatment = typeof TREATMENTS[number];