import { bugs, SAMPLE_SIDES, SITES, TREATMENTS } from "./config";

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
  sampleAmount: number;
}

export interface Sample {
  phenologicalState: number;
  femaleFlowerPercentage: number;
  samplingLength: number;
  counts: number[];
  comments: string;
}

export type Site = typeof SITES[number];
export type Treatment = typeof TREATMENTS[number];
export type SampleSide = typeof SAMPLE_SIDES[number];

export type Bug = typeof bugs[number];