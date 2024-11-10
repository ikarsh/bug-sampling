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