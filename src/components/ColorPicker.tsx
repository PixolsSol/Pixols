import { FC } from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const colors = [
    // Vibrant colors
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FF8000', '#FF0080',
    // Pastel colors
    '#FFB3B3', '#B3FFB3', '#B3B3FF', '#FFFFB3',
    '#FFB3FF', '#B3FFFF', '#FFD9B3', '#FFB3D9',
    // Dark colors
    '#800000', '#008000', '#000080', '#808000',
    '#800080', '#008080', '#804000', '#800040',
    // Basic colors
    '#000000', '#FFFFFF', '#808080', '#C0C0C0'
  ];

  return (
    <div className="flex flex-wrap gap-2 max-w-md justify-center">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
            color === selectedColor ? 'border-blue-500 scale-110' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
  );
};