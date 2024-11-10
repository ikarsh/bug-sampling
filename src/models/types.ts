export interface BugType {
    name: string;
    image: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface SamplingData {
    name: string;
    startTime: string;
    duration: number;
    location: Location | null;
    counts: Array<{
      bugType: string;
      count: number;
    }>;
  }