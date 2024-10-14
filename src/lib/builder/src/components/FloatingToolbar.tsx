import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FloatingToolbarProps {
  position: { x: number; y: number };
  visible: boolean;
  applyFormatting: (command: string, value?: string) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ position, visible, applyFormatting }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed bg-white border shadow-md p-2 flex rounded-md"
      style={{
        top: `${position.y - 20}px`, // Position 20px above the element
        left: `${position.x - 120}px`,
        zIndex: 1000, // Ensure it's above other elements
      }}
    >
      <button onClick={() => applyFormatting('bold')} className="p-2 hover:bg-gray-100">
        <Bold size={16} />
      </button>
      <button onClick={() => applyFormatting('italic')} className="p-2 hover:bg-gray-100">
        <Italic size={16} />
      </button>
      <button onClick={() => applyFormatting('underline')} className="p-2 hover:bg-gray-100">
        <Underline size={16} />
      </button>
      <button onClick={() => applyFormatting('justifyLeft')} className="p-2 hover:bg-gray-100">
        <AlignLeft size={16} />
      </button>
      <button onClick={() => applyFormatting('justifyCenter')} className="p-2 hover:bg-gray-100">
        <AlignCenter size={16} />
      </button>
      <button onClick={() => applyFormatting('justifyRight')} className="p-2 hover:bg-gray-100">
        <AlignRight size={16} />
      </button>
    </div>
  );
};

export default FloatingToolbar;