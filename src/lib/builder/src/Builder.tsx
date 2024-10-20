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
import {
    handleUpdateElement, handleAddElement, handleDeleteElement, handlePageSizeChange,
    handleUndo, handleRedo, handleAddPage, handleDuplicatePage, handleDeletePage, switchPage, setTemplateContent
} from './builderMethods';

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

    const updateElement = useCallback(
        (updatedElement) => {
            handleUpdateElement(updatedElement, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex]
    );

    const addElement = useCallback(
        (newElement) => {
            handleAddElement(newElement, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex]
    );

    const deleteElement = useCallback(
        (elementId) => {
            handleDeleteElement(elementId, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex]
    );

    const handleUndoAction = useCallback(() => {
        handleUndo(setHistoryIndex, historyIndex, setElements, history);
    }, [history, historyIndex]);

    const handleRedoAction = useCallback(() => {
        handleRedo(setHistoryIndex, historyIndex, setElements, history);
    }, [history, historyIndex]);

    const changePageSize = useCallback((width, height) => {
        handlePageSizeChange(width, height, setCanvasSize);
    }, []);

    if (isLoading) {
        return <Loader />;
    }



    return (
        <ThemeProvider>
            <div className="flex h-screen">
                <LeftSideMenu
                    addElement={addElement}
                    setTemplateContent={(content) =>
                        setTemplateContent(content, setElements, setHistory, historyIndex, setHistoryIndex, currentPage, pages, setPages, savePages)
                    }
                    isCanvasEmpty={elements.length === 0}
                    canvasSize={canvasSize}
                />
                <div className="flex flex-col flex-1">
                    <TopBar
                        selectedElement={selectedElement}
                        updateElement={updateElement}
                        undo={handleUndoAction}
                        redo={handleRedoAction}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                        generateSourceCode={() => ''}
                        onPageSizeChange={changePageSize}
                        canvasSize={canvasSize}
                        elements={elements}
                        onViewSourceCode={() => setIsViewSourceModalOpen(true)}
                        onPreview={() => setIsPreviewModalOpen(true)}
                    />
                    <div className="flex flex-1 overflow-hidden">
                        <Canvas
                            elements={elements}
                            updateElement={updateElement}
                            deleteElement={deleteElement}
                            setSelectedElement={setSelectedElement}
                            selectedElement={selectedElement}
                            canvasSize={canvasSize}
                            zoom={zoom}
                            setZoom={setZoom}
                        />
                        <RightSidebar
                            pages={pages}
                            currentPage={currentPage}
                            setCurrentPage={(pageNumber) =>
                                switchPage(
                                    pageNumber, currentPage, elements, pages, setPages, setCurrentPage, setElements, setHistory, setHistoryIndex
                                )
                            }
                            addNewPage={() => handleAddPage(pages, setPages, setCurrentPage, setElements)}
                            duplicatePage={(pageNumber) => handleDuplicatePage(pageNumber, pages, setPages)}
                            deletePage={(pageNumber) =>
                                handleDeletePage(pageNumber, pages, setPages, currentPage, setCurrentPage, setElements)
                            }
                        />
                    </div>
                </div>
                <ViewSourceModal
                    isOpen={isViewSourceModalOpen}
                    onClose={() => setIsViewSourceModalOpen(false)}
                    elements={elements}
                    canvasSize={canvasSize}
                    pages={pages}
                />
                <PreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    pages={pages}
                    currentPage={currentPage}
                    canvasSize={canvasSize}
                    elements={elements}
                />
            </div>
        </ThemeProvider>
    );
};

export default Builder;
