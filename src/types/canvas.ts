export interface Pixel {
  x: number;
  y: number;
  color: string;
  owner: string | null;
  timestamp: number;
}

export interface PixelHistory {
  color: string;
  owner: string;
  timestamp: number;
}

export interface CanvasState {
  pixels: Record<string, Pixel>;
  selectedColor: string;
  pixelHistory: Record<string, PixelHistory[]>;
  setSelectedColor: (color: string) => void;
  claimPixel: (x: number, y: number, owner: string) => void;
  updatePixel: (x: number, y: number, color: string) => void;
  selectedPixel: { x: number; y: number } | null;
  setSelectedPixel: (pixel: { x: number; y: number } | null) => void;
}