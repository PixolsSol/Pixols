import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TOKENS_PER_PIXEL } from '../config/solana';

interface BurnTokensModalProps {
  balance: number;
  onClose: () => void;
  onBurn: (amount: number) => void;
}

export const BurnTokensModal: React.FC<BurnTokensModalProps> = ({
  balance,
  onClose,
  onBurn,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const burnAmount = customAmount ? Number(customAmount) : Math.floor((balance * percentage) / 100);
  const pixelsToReceive = Math.floor(burnAmount / TOKENS_PER_PIXEL);

  // Update custom amount when slider changes
  useEffect(() => {
    if (!customAmount) {
      setCustomAmount(Math.floor((balance * percentage) / 100).toString());
    }
  }, [percentage, balance]);

  const handleCustomAmountChange = (value: string) => {
    const num = value === '' ? 0 : Number(value);
    if (num <= balance && !isNaN(num)) {
      setCustomAmount(value);
      setPercentage((num / balance) * 100);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Burn Tokens for Pixols</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select amount to burn ({percentage.toFixed(1)}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => {
                setPercentage(Number(e.target.value));
                setCustomAmount('');
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Or enter custom amount
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Enter amount to burn"
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              min="0"
              max={balance}
            />
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <p className="text-sm flex justify-between">
              <span>Amount to burn:</span>
              <span className="font-mono">{burnAmount} tokens</span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Pixels to receive:</span>
              <span className="font-mono">{pixelsToReceive} pixels</span>
            </p>
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p>• 10 $Pixol = 1 Pixel</p>
            <p>• Total Supply: 1,000,000,000 $Pixol</p>
            <p>• Total Pixels: 1,000 x 1,000</p>
          </div>
          
          <button
            onClick={() => onBurn(burnAmount)}
            disabled={burnAmount === 0}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            Burn Tokens
          </button>
        </div>
      </div>
    </div>
  );
};