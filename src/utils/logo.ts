import { useCanvasStore } from '../store/useCanvasStore';

// Pixel art font for "PIXOL"
const LOGO_PIXELS = [
  // P
  [1,1,1,1],[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,0],[1,0,0,0],
  // I
  [0,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1],
  // X
  [1,0,0,1],[0,1,0,1],[0,0,1,0],[0,1,0,1],[1,0,0,1],
  // O
  [0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],
  // L
  [1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1],
];

export const drawLogo = () => {
  const store = useCanvasStore.getState();
  const startX = 10; // Starting X position
  const startY = 10; // Starting Y position
  const pixelSize = 4; // Size of each pixel in the logo
  const color = '#8B5CF6'; // Purple color for the logo

  LOGO_PIXELS.forEach((column, x) => {
    column.forEach((pixel, y) => {
      if (pixel === 1) {
        const pixelKey = `${startX + x},${startY + y}`;
        store.updatePixel(pixelKey, color);
        // Mark as permanent by adding to initial state
        store.pixels[pixelKey] = {
          color,
          owner: 'PIXOL_LOGO',
          timestamp: Date.now(),
          permanent: true
        };
      }
    });
  });
};