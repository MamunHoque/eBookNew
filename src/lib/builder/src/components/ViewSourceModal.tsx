import React, { useRef, useContext } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { Element } from '../types';

interface ViewSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: Element[];
  canvasSize: { width: number; height: number };
}

const ViewSourceModal: React.FC<ViewSourceModalProps> = ({ isOpen, onClose, elements, canvasSize }) => {
  const [copied, setCopied] = React.useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isDark } = useContext(ThemeContext);

  if (!isOpen) return null;

  const generateSourceCode = () => {
    const canvasStyle = `
      width: ${canvasSize.width * 96}px;
      height: ${canvasSize.height * 96}px;
      position: relative;
      background-color: white;
      margin: auto;
    `;

    const elementsHtml = elements.map(element => {
      const style = `
        position: absolute;
        left: ${element.left}%;
        top: ${element.top}%;
        width: ${element.width}%;
        height: ${element.height}%;
        z-index: ${element.zIndex};
        ${Object.entries(element.style || {}).map(([key, value]) => `${key}: ${value};`).join(' ')}
      `;

      return `<${element.type} style="${style.trim()}">${element.content}</${element.type}>`;
    }).join('\n    ');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>eBook Page</title>
</head>
<body>
  <div style="${canvasStyle.trim()}">
    ${elementsHtml}
  </div>
</body>
</html>`.trim();
  };

  const sourceCode = generateSourceCode();
  const formattedSourceCode = sourceCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg w-3/4 max-w-3xl max-h-[80vh] flex flex-col ${isDark ? 'dark' : ''}`}>
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">View Source Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <pre className="w-full h-full min-h-[300px] p-2 text-sm font-mono bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded whitespace-pre-wrap">
            <code dangerouslySetInnerHTML={{ __html: formattedSourceCode }} />
          </pre>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSourceModal;