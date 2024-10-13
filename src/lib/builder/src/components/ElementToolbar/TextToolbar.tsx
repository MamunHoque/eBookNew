import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextToolbarProps {
  onFormatChange: (format: string, value: any) => void;
}

const TextToolbar: React.FC<TextToolbarProps> = ({ onFormatChange }) => {
  const buttonClass = "p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors";
  const iconClass = "text-gray-600 dark:text-gray-300";

  return (
    <div className="flex space-x-2">
     ElementToolBarArea
    </div>
  );
};

export default TextToolbar;