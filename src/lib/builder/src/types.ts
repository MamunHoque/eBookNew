export interface Element {
  id: string;
  type: 'text' | 'image' | 'shape'; // Add more types as needed
  content: string;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  style?: {
    [key: string]: string | number | boolean;
  };
}

export interface Page {
  pageNumber: number;
  content: string;
}