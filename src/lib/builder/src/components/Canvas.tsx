"use client";

import React, { useRef } from 'react';
import CanvasElement from './CanvasElement';
import { Element, Page } from '../types';
import ZoomToolbar from './ZoomToolbar';

interface CanvasProps {
  elements: Element[];
  updateElement: (updatedElement: Element) => void;
  deleteElement: (elementId: string) => void;
  setSelectedElement: (element: Element | null) => void;
  selectedElement: Element | null;
  canvasSize: { width: number; height: number };
  zoom: number;
  setZoom: (zoom: number) => void;
  currentPage: number;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
}

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
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

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
    </div>
  );
};

export default Canvas;