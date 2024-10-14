import React from 'react';
import { Image, Maximize2, MinusSquare, PlusSquare } from 'lucide-react';

interface ImageToolbarProps {
  onUpload: () => void;
  onResize: (action: 'increase' | 'decrease') => void;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({ onUpload, onResize }) => {
  const buttonClass = "p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors";
  const iconClass = "text-gray-600 dark:text-gray-300";

  return (
    <>
      <button onClick={onUpload} className={buttonClass} title="Upload Image">
        <Image size={18} className={iconClass} />
      </button>
      <button onClick={() => onResize('increase')} className={buttonClass} title="Increase Size">
        <PlusSquare size={18} className={iconClass} />
      </button>
      <button onClick={() => onResize('decrease')} className={buttonClass} title="Decrease Size">
        <MinusSquare size={18} className={iconClass} />
      </button>
      <button onClick={() => {}} className={buttonClass} title="Fit to Container">
        <Maximize2 size={18} className={iconClass} />
      </button>
    </>
  );
};

export default ImageToolbar;