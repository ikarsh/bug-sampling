export interface BugType {
    name: string;
    image: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface HTMLElementWithDataset extends HTMLElement {
    dataset: {
      screen: string;
      active: string;
    };
  }
  
  export interface Screen extends HTMLElementWithDataset {
    dataset: {
      screen: string;
      active: string;
    };
  }