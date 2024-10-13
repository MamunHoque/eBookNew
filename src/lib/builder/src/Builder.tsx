"use client";

import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import LeftSideMenu from './components/LeftSideMenu/LeftSideMenu';
import Canvas from './components/Canvas';
import RightSidebar from './components/RightSidebar';
import ViewSourceModal from './components/ViewSourceModal';
import PreviewModal from './components/PreviewModal';
import Loader from './components/Loader';
import { Element, Page } from './types';
import { initDB, savePages, getPages } from './utils/indexedDB';
import './builder.css';
import { ThemeProvider } from './context/ThemeContext';

const Builder: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([{ pageNumber: 1, content: '[]' }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 8.5, height: 11 });
  const [zoom, setZoom] = useState(100);
  const [isDBInitialized, setIsDBInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New state for undo/redo functionality
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const initialize = async () => {
      await initDB();
      setIsDBInitialized(true);
      const storedPages = await getPages();
      if (storedPages.length > 0) {
        setPages(storedPages);
        const initialElements = JSON.parse(storedPages[0].content);
        setElements(initialElements);
        setHistory([initialElements]);
        setHistoryIndex(0);
      }
      setIsLoading(false);
    };
    initialize();
  }, []);

  const addToHistory = useCallback((newElements: Element[]) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [...newHistory, newElements];
    });
    setHistoryIndex(prevIndex => prevIndex + 1);
  }, [historyIndex]);

  const handleUpdateElement = useCallback((updatedElement: Element) => {
    setElements(prevElements => {
      const newElements = prevElements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      );
      addToHistory(newElements);
      return newElements;
    });
  }, [addToHistory]);

  const handleAddElement = useCallback((newElement: Element) => {
    setElements(prevElements => {
      const newElements = [...prevElements, newElement];
      addToHistory(newElements);
      return newElements;
    });
  }, [addToHistory]);

  const handleDeleteElement = useCallback((elementId: string) => {
    setElements(prevElements => {
      const newElements = prevElements.filter(el => el.id !== elementId);
      addToHistory(newElements);
      return newElements;
    });
  }, [addToHistory]);

  const handlePageSizeChange = useCallback((width: number, height: number) => {
    setCanvasSize({ width, height });
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const setTemplateContent = useCallback((content: string) => {
    try {
      const parsedContent = JSON.parse(content);
      setElements(parsedContent);
      addToHistory(parsedContent);
    } catch (error) {
      const newElement: {
        top: number;
        left: number;
        width: number;
        id: string;
        type: string;
        content: string;
        height: number;
        zIndex: number
      } = {
        id: Date.now().toString(),
        type: 'div',
        content: content,
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        zIndex: 1,
      };
      setElements([newElement]);
      addToHistory([newElement]);
    }
  }, [addToHistory]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <LeftSideMenu
          addElement={handleAddElement}
          setTemplateContent={setTemplateContent}
          isCanvasEmpty={elements.length === 0}
          canvasSize={canvasSize}
        />
        <div className="flex flex-col flex-1">
          <TopBar
            selectedElement={selectedElement}
            updateElement={handleUpdateElement}
            undo={handleUndo}
            redo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            generateSourceCode={() => ''}
            onPageSizeChange={handlePageSizeChange}
            canvasSize={canvasSize}
            elements={elements}
            onViewSourceCode={() => setIsViewSourceModalOpen(true)}
            onPreview={() => setIsPreviewModalOpen(true)}
          />
        
          <div className="flex flex-1 overflow-hidden">
            <Canvas
              elements={elements}
              updateElement={handleUpdateElement}
              deleteElement={handleDeleteElement}
              setSelectedElement={setSelectedElement}
              selectedElement={selectedElement}
              canvasSize={canvasSize}
              zoom={zoom}
              setZoom={setZoom}
            />
            <RightSidebar
              pages={pages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              addNewPage={() => {}}
              duplicatePage={() => {}}
              deletePage={() => {}}
            />
          </div>
        </div>
        <ViewSourceModal
          isOpen={isViewSourceModalOpen}
          onClose={() => setIsViewSourceModalOpen(false)}
          elements={elements}
          canvasSize={canvasSize}
        />
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          pages={pages}
          currentPage={currentPage}
          canvasSize={canvasSize}
          elements={elements} // Add this line

        />
      </div>
    </ThemeProvider>
  );
};

export default Builder;