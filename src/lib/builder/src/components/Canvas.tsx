import React, { useRef, useEffect, useState } from 'react';
import CanvasElement from './CanvasElement';
import ZoomToolbar from './ZoomToolbar';
import { Element, Page, CanvasProps } from '../types';
import ConfirmationModal from './ConfirmationModal';
import detectSource from '../utils/detectSource';
import cleanContent from '../utils/cleanContent';

const Canvas: React.FC<CanvasProps> = ({
  elements,
  updateElement,
  deleteElement,
  setSelectedElement,
  selectedElement,
  canvasSize,
  zoom,
  setZoom,
  currentPage,
  pages,
  setPages,
  addElement,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedContent, setPastedContent] = useState('');
  const [contentSource, setContentSource] = useState<'microsoft_office' | 'google_docs' | 'excel' | 'unknown'>('unknown');

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/html') || e.clipboardData?.getData('text');
      if (text) {
        setPastedContent(text);
        setContentSource(detectSource(text));
        setShowPasteModal(true);
      }
    };

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('paste', handlePaste);
    }

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  const handlePasteConfirm = (keepFormatting: boolean) => {
    const cleanedContent = cleanContent(pastedContent, contentSource, keepFormatting);
    const newElement: Element = {
      id: Date.now().toString(),
      type: 'div',
      content: cleanedContent,
      left: 0,
      top: 0,
      width: 100, // Set to 100% of canvas width
      height: 100, // Set to 100% of canvas height
      zIndex: elements.length + 1,
      style: {
        overflow: 'auto',
        padding: '20px',
        boxSizing: 'border-box',
      },
    };
    addElement(newElement);
    setShowPasteModal(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  };

  const canvasStyle: React.CSSProperties = {
    width: `${canvasSize.width * 96}px`,
    height: `${canvasSize.height * 96}px`,
    backgroundColor: 'white',
    color: 'black',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top left',
    transition: 'transform 0.3s ease',
    padding: '40px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px 0',
    position: 'relative',
  };

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div style={containerStyle} className="canvas-container">
        <style>
          {`
            .canvas-container::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <div
          ref={canvasRef}
          className="canvas relative"
          onClick={handleCanvasClick}
          style={canvasStyle}
        >
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={() => setSelectedElement(element)}
              onUpdate={updateElement}
              onDelete={deleteElement}
              canvasSize={canvasSize}
              zoom={zoom}
              currentPage={currentPage}
              pages={pages}
              setPages={setPages}
            />
          ))}
        </div>
      </div>
      <ZoomToolbar
        zoom={zoom}
        onZoom={setZoom}
        onPageNext={() => {}}
        onPagePrevious={() => {}}
      />
      <ConfirmationModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onConfirm={() => handlePasteConfirm(true)}
        onCancel={() => handlePasteConfirm(false)}
        message="How would you like to paste the content?"
        confirmText="Keep Formatting"
        cancelText="Remove Formatting"
      />
    </div>
  );
};

export default Canvas;