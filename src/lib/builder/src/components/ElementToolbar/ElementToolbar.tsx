import React from 'react';
import TextToolbar from './TextToolbar';
import ImageToolbar from './ImageToolbar';
import { Element } from '../../types';

interface ElementToolbarProps {
  selectedElement: Element;
  onStyleChange: (style: string, value: any) => void;
  onAlignChange: (align: string) => void;
  onImageUpload: () => void;
  onImageResize: (action: 'increase' | 'decrease') => void;
}

const ElementToolbar: React.FC<ElementToolbarProps> = ({
  selectedElement,
  onStyleChange,
  onAlignChange,
  onImageUpload,
  onImageResize,
}) => {
  const isTextElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(selectedElement.type);

  const handleFormatChange = (format: string, value: any) => {
    if (format === 'textAlign') {
      onAlignChange(value);
    } else {
      onStyleChange(format, value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md flex p-1">
      {isTextElement && (
        <TextToolbar onFormatChange={handleFormatChange} />
      )}
      {selectedElement.type === 'image' && (
        <ImageToolbar onUpload={onImageUpload} onResize={onImageResize} />
      )}
    </div>
  );
};

export default ElementToolbar;