import React from 'react';
import { Paintbrush } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-white shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-3 rounded-full">
            <Paintbrush className="w-8 h-8" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Pixol! 🎨</h2>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-purple-400">1.</span> Burn $Pixol to secure spots, 10 $Pixol = 1 Pixel
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-purple-400">2.</span> There is a Total of 1000x1000 Pixels
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-purple-400">3.</span> Updated Pixels are permanent and can't be changed
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-center"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};