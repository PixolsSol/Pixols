import create from 'zustand';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKENS_PER_PIXEL } from '../config/solana';
import { transferTokensForPixels } from '../utils/token';

interface PixelData {
  color: string;
  owner: string;
  timestamp: number;
  permanent?: boolean;
}

interface CanvasState {
  pixels: { [key: string]: PixelData };
  selectedColor: string;
  isClaimMode: boolean;
  availablePixels: number;
  selectedPixels: string[];
  transactionStatus: {
    status: 'pending' | 'success' | 'error' | null;
    message: string;
  };
  setSelectedColor: (color: string) => void;
  setClaimMode: (isActive: boolean) => void;
  setAvailablePixels: (count: number) => void;
  togglePixelSelection: (key: string) => void;
  claimSelectedPixels: (
    connection: Connection,
    wallet: { publicKey: PublicKey; signTransaction: any }
  ) => Promise<void>;
  updatePixel: (key: string, color: string) => void;
  clearSelectedPixels: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  pixels: {},
  selectedColor: '#000000',
  isClaimMode: false,
  availablePixels: 0,
  selectedPixels: [],
  transactionStatus: {
    status: null,
    message: ''
  },
  setSelectedColor: (color: string) => set({ selectedColor: color }),
  setClaimMode: (isActive: boolean) => set({ isClaimMode: isActive }),
  setAvailablePixels: (count: number) => set({ availablePixels: count }),
  togglePixelSelection: (key: string) => {
    const { selectedPixels, availablePixels, pixels } = get();
    
    // Don't allow selecting permanent pixels
    if (pixels[key]?.permanent) return;
    
    const isSelected = selectedPixels.includes(key);
    
    if (!isSelected && selectedPixels.length >= availablePixels) {
      return;
    }

    set(state => ({
      selectedPixels: isSelected
        ? state.selectedPixels.filter(p => p !== key)
        : [...state.selectedPixels, key]
    }));
  },
  claimSelectedPixels: async (connection, wallet) => {
    const { selectedPixels, selectedColor } = get();
    
    if (selectedPixels.length === 0) return;

    set({
      transactionStatus: {
        status: 'pending',
        message: 'Transferring tokens...'
      }
    });

    try {
      await transferTokensForPixels(connection, wallet, selectedPixels.length);

      // Update pixels after successful transfer
      const updates = selectedPixels.reduce((acc, key) => ({
        ...acc,
        [key]: {
          color: selectedColor,
          owner: wallet.publicKey.toString(),
          timestamp: Date.now()
        }
      }), {});

      set(state => ({
        pixels: { ...state.pixels, ...updates },
        selectedPixels: [],
        isClaimMode: false,
        transactionStatus: {
          status: 'success',
          message: `Successfully claimed ${selectedPixels.length} pixels!`
        }
      }));
    } catch (error) {
      set({
        transactionStatus: {
          status: 'error',
          message: 'Failed to transfer tokens. Please try again.'
        }
      });
    }
  },
  updatePixel: (key: string, color: string) => {
    set(state => ({
      pixels: {
        ...state.pixels,
        [key]: {
          ...state.pixels[key],
          color,
          timestamp: Date.now()
        }
      }
    }));
  },
  clearSelectedPixels: () => {
    set({ selectedPixels: [] });
  }
}));