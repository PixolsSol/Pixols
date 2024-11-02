import { useEffect, useCallback } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const useWebSocket = () => {
  const { updatePixel } = useCanvasStore();

  const connect = useCallback(() => {
    // Temporarily disable WebSocket connection for development
    return {
      close: () => {}
    };
  }, [updatePixel]);

  useEffect(() => {
    const ws = connect();
    return () => ws.close();
  }, [connect]);
};