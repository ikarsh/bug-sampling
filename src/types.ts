import { bugs, SITES, TREATMENTS } from "./config";

export interface BugInterface {
  name: string;
  image: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Location = Coordinates | 'N/A';

export interface SessionSetup {
  date: Date;
  location: Location;  // Now can be either coordinates or 'N/A'
  site: Site;
  treatment: Treatment;
}

export interface Sample {
  phenologicalState: number;
  femaleFlowerPercentage: number;
  samplingLength: number;
  counts: number[];
}

export type Site = typeof SITES[number];
export type Treatment = typeof TREATMENTS[number];

export type Bug = typeof bugs[number];