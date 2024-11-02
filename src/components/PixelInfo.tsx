import React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { formatDistance } from 'date-fns';

export const PixelInfo: React.FC = () => {
  const { selectedPixel, pixels, pixelHistory } = useCanvasStore();

  if (!selectedPixel) return null;

  const key = `${selectedPixel.x},${selectedPixel.y}`;
  const pixel = pixels[key];
  const history = pixelHistory[key] || [];

  if (!pixel) return null;

  return (
    <div className="absolute left-4 bottom-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-semibold mb-2">Pixel Information</h3>
      <div className="space-y-2">
        <p className="text-sm">
          Position: ({selectedPixel.x}, {selectedPixel.y})
        </p>
        <p className="text-sm">
          Current Owner:{' '}
          <span className="font-mono text-xs">
            {pixel.owner?.slice(0, 8)}...{pixel.owner?.slice(-8)}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: pixel.color }}
          />
          <span className="text-sm">{pixel.color}</span>
        </div>
        
        {history.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">History</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((entry, i) => (
                <div key={i} className="text-xs space-y-1 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.color}</span>
                  </div>
                  <p className="text-gray-600">
                    {formatDistance(entry.timestamp, new Date(), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};