import React from 'react';
import { Canvas } from './Canvas';
import { ColorPicker } from './ColorPicker';

export const PixelCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100vh-5rem)]">
      <Canvas />
      <ColorPicker />
    </div>
  );
};