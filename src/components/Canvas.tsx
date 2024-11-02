import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useCanvasStore } from '../store/useCanvasStore';
import { CANVAS_SIZE, PIXEL_SIZE } from '../config/solana';
import { BurnTokensModal } from './BurnTokensModal';
import { TransactionStatus } from './TransactionStatus';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(0.5); // Start zoomed out for better overview
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const { publicKey } = useWallet();
  const { balance } = useTokenBalance();
  const {
    pixels,
    selectedColor,
    isClaimMode,
    selectedPixels,
    transactionStatus,
    togglePixelSelection,
    setSelectedColor,
  } = useCanvasStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to exactly 1000x1000
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw all pixels
    Object.entries(pixels).forEach(([key, data]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = data.color;
      ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });

    // Draw selected pixels with border
    selectedPixels.forEach(key => {
      const [x, y] = key.split(',').map(Number);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });

    // Draw grid when zoomed in enough
    if (scale > 0.8) {
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= CANVAS_SIZE; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }
    }
  }, [pixels, selectedPixels, scale]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isClaimMode || !publicKey) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor((e.clientX - rect.left - offset.x) / scale);
    const y = Math.floor((e.clientY - rect.top - offset.y) / scale);

    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
      togglePixelSelection(`${x},${y}`);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(5, newScale));
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      <div
        className="relative w-full h-full cursor-crosshair"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="bg-white shadow-lg"
        />
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 bg-white rounded-lg hover:bg-gray-50 shadow-lg"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 bg-white rounded-lg hover:bg-gray-50 shadow-lg"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
        <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />
      </div>

      {/* Burn button */}
      {publicKey && (
        <button
          onClick={() => setShowBurnModal(true)}
          className="absolute top-4 left-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium shadow-lg"
        >
          Burn for Pixels ({balance.toFixed(2)} tokens available)
        </button>
      )}

      {/* Modals and status */}
      {showBurnModal && (
        <BurnTokensModal
          balance={balance}
          onClose={() => setShowBurnModal(false)}
          onBurn={(amount) => {
            setShowBurnModal(false);
            useCanvasStore.getState().setClaimMode(true);
            useCanvasStore.getState().setAvailablePixels(Math.floor(amount / 10));
          }}
        />
      )}
      <TransactionStatus status={transactionStatus} />
    </div>
  );
};