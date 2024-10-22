import React, { useState, useEffect, useCallback, memo } from 'react';
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

// @ts-ignore
import {
    handleUpdateElement, handleAddElement, handleDeleteElement, handlePageSizeChange,
    handleUndo, handleRedo, handleAddPage, handleDuplicatePage, handleDeletePage, switchPage, setTemplateContent
} from './builderMethods.js';

// Memoized components to avoid unnecessary re-renders
const MemoizedLeftSideMenu = memo(LeftSideMenu);
const MemoizedTopBar = memo(TopBar);
const MemoizedCanvas = memo(Canvas);
const MemoizedRightSidebar = memo(RightSidebar);
const MemoizedViewSourceModal = memo(ViewSourceModal);
const MemoizedPreviewModal = memo(PreviewModal);

const Builder: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([{ pageNumber: 1, content: '[]' }]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [isViewSourceModalOpen, setIsViewSourceModalOpen] = useState<boolean>(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
    const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 8.5, height: 11 });
    const [zoom, setZoom] = useState<number>(100);
    const [isDBInitialized, setIsDBInitialized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [history, setHistory] = useState<Element[][]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    // Initialize IndexedDB and load saved pages and elements from the database
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

    // Callback to update an element's properties and update the history
    const updateElement = useCallback(
        (updatedElement: Element) => {
            handleUpdateElement(updatedElement, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex, setElements, setHistory, setHistoryIndex]
    );

    // Callback to add a new element and update the history
    const addElement = useCallback(
        (newElement: Element) => {
            handleAddElement(newElement, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex, setElements, setHistory, setHistoryIndex]
    );

    // Callback to delete an element by its ID and update the history
    const deleteElement = useCallback(
        (elementId: string) => {
            handleDeleteElement(elementId, setElements, setHistory, historyIndex, setHistoryIndex);
        },
        [historyIndex, setElements, setHistory, setHistoryIndex]
    );

    // Callback to handle the undo action
    const handleUndoAction = useCallback(() => {
        handleUndo(setHistoryIndex, historyIndex, setElements, history);
    }, [history, historyIndex]);

    // Callback to handle the redo action
    const handleRedoAction = useCallback(() => {
        handleRedo(setHistoryIndex, historyIndex, setElements, history);
    }, [history, historyIndex]);

    // Callback to handle page size change
    const changePageSize = useCallback((width: number, height: number) => {
        handlePageSizeChange(width, height, setCanvasSize);
    }, []);

    // Render the loader if the data is still loading from IndexedDB
    if (isLoading) {
        return <Loader />;
    }

    // @ts-ignore
    return (
        <ThemeProvider>
            <div className="flex h-screen">
                {/* Left sidebar for adding elements and setting template content */}
                <MemoizedLeftSideMenu
                    addElement={addElement}
                    setTemplateContent={(content) =>
                        setTemplateContent(
                            content,
                            setElements,
                            setHistory,
                            historyIndex,
                            setHistoryIndex,
                            currentPage,
                            pages,
                            setPages,
                            savePages
                        )
                    }
                    isCanvasEmpty={elements.length === 0}
                    canvasSize={canvasSize}
                />

                <div className="flex flex-col flex-1">
                    {/* Top bar for handling undo/redo actions, viewing source code, etc. */}
                    <MemoizedTopBar
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
                        {/* Canvas area to display and manipulate elements */}
                        <MemoizedCanvas
                            elements={elements}
                            updateElement={updateElement}
                            deleteElement={deleteElement}
                            setSelectedElement={setSelectedElement}
                            selectedElement={selectedElement}
                            canvasSize={canvasSize}
                            zoom={zoom}
                            setZoom={setZoom}
                        />

                        {/* Right sidebar for page management (add, delete, switch pages) */}
                        <MemoizedRightSidebar
                            pages={pages}
                            currentPage={currentPage}
                            setCurrentPage={(pageNumber) =>
                                switchPage(
                                    pageNumber,
                                    currentPage,
                                    elements,
                                    pages,
                                    setPages,
                                    setCurrentPage,
                                    setElements,
                                    setHistory,
                                    setHistoryIndex
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

                {/* Modal for viewing the raw source code */}
                <MemoizedViewSourceModal
                    isOpen={isViewSourceModalOpen}
                    onClose={() => setIsViewSourceModalOpen(false)}
                    elements={elements}
                    canvasSize={canvasSize}
                    pages={pages}
                />

                {/* Modal for previewing the document */}
                <MemoizedPreviewModal
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
