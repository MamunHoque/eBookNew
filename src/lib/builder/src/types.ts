export interface Element {
  id: string;
  type: string;
  content: string;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface Page {
  pageNumber: number;
  content: string;
}