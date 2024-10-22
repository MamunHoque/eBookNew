export interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'; // Add more types as needed
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