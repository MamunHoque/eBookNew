"use client";

import React, { useRef, useEffect, useState, useContext } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Element, Page } from '../types';
import { ThemeContext } from '../context/ThemeContext';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  currentPage: number;
  canvasSize: { width: number; height: number };
  elements: Element[]; // The elements of the current page
}

const PreviewModal: React.FC<PreviewModalProps> = ({
                                                     isOpen,
                                                     onClose,
                                                     pages,
                                                     currentPage,
                                                     canvasSize,
                                                     elements, // The elements for the initial current page
                                                   }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [pageElements, setPageElements] = useState<Element[]>(elements);
  const { isDark } = useContext(ThemeContext);

  // Update the elements based on the currently displayed page
  useEffect(() => {
    const currentPageContent = pages.find((page) => page.pageNumber === displayPage);
    if (currentPageContent) {
      const newElements = JSON.parse(currentPageContent.content);
      setPageElements(newElements);
    }
  }, [displayPage, pages]);

  if (!isOpen) return null;

  const pageStyle: React.CSSProperties = {
    width: `${canvasSize.width}in`,
    height: `${canvasSize.height}in`,
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    color: 'black',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    padding: '40px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'auto',
  };

  const handlePrevPage = () => {
    setDisplayPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setDisplayPage((prev) => Math.min(pages.length, prev + 1));
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white dark:bg-gray-800 rounded-lg w-3/4 max-w-3xl max-h-[90vh] flex flex-col ${isDark ? 'dark' : ''}`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Preview - Page {displayPage}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <div ref={previewRef} className="flex-grow bg-gray-200 dark:bg-gray-900 relative" style={containerStyle}>
            <div style={pageStyle}>
              {pageElements.map((element: Element) => (
                  <div
                      key={element.id}
                      style={{
                        position: 'absolute',
                        left: `${element.left}%`,
                        top: `${element.top}%`,
                        width: `${element.width}%`,
                        height: `${element.height}%`,
                        zIndex: element.zIndex,
                        ...element.style,
                      }}
                      dangerouslySetInnerHTML={{ __html: element.content }}
                  />
              ))}
            </div>
            <button
                onClick={handlePrevPage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
                disabled={displayPage === 1}
            >
              <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
                onClick={handleNextPage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
                disabled={displayPage === pages.length}
            >
              <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default PreviewModal;
