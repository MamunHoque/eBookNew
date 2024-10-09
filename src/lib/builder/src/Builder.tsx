import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import LeftSideMenu from './components/LeftSideMenu/LeftSideMenu';
import Canvas from './components/Canvas';
import RightSidebar from './components/RightSidebar/RightSidebar';
import ViewSourceModal from './components/ViewSourceModal';
import PreviewModal from './components/PreviewModal';
import Loader from './components/Loader';
import { Element, Page } from './types';
import { initDB, savePages, getPages } from './utils/indexedDB';

export default function Builder() {
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

    useEffect(() => {
        const initialize = async () => {
            await initDB();
            setIsDBInitialized(true);
            const storedPages = await getPages();
            if (storedPages.length > 0) {
                setPages(storedPages);
                setElements(JSON.parse(storedPages[0].content));
            }
            setIsLoading(false);
        };
        initialize();
    }, []);

    const handleUpdateElement = useCallback((updatedElement: Element) => {
        setElements((prevElements) =>
            prevElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
        );
    }, []);

    const handleAddElement = useCallback((newElement: Element) => {
        setElements((prevElements) => [...prevElements, newElement]);
    }, []);

    const handleDeleteElement = useCallback((elementId: string) => {
        setElements((prevElements) => prevElements.filter((el) => el.id !== elementId));
    }, []);

    const handlePageSizeChange = useCallback((width: number, height: number) => {
        setCanvasSize({ width, height });
    }, []);

    const handleAddPage = useCallback(() => {
        setPages((prevPages) => [
            ...prevPages,
            { pageNumber: prevPages.length + 1, content: '[]' },
        ]);
    }, []);

    const handleDuplicatePage = useCallback(
        (pageNumber: number) => {
            const pageToDuplicate = pages.find((page) => page.pageNumber === pageNumber);
            if (pageToDuplicate) {
                setPages((prevPages) => [
                    ...prevPages,
                    { pageNumber: prevPages.length + 1, content: pageToDuplicate.content },
                ]);
            }
        },
        [pages]
    );

    const handleDeletePage = useCallback(
        (pageNumber: number) => {
            if (pages.length > 1) {
                setPages((prevPages) =>
                    prevPages
                        .filter((page) => page.pageNumber !== pageNumber)
                        .map((page, index) => ({ ...page, pageNumber: index + 1 }))
                );
            }
        },
        [pages]
    );

    const setTemplateContent = useCallback(
        (content: string) => {
            const newElement: Element = {
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
            setPages((prevPages) =>
                prevPages.map((page) =>
                    page.pageNumber === currentPage
                        ? { ...page, content: JSON.stringify([newElement]) }
                        : page
                )
            );
        },
        [currentPage]
    );

    useEffect(() => {
        if (isDBInitialized) {
            savePages(pages);
        }
    }, [pages, isDBInitialized]);

    if (isLoading) {
        return <Loader />;
    }

    return (
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
                    undo={() => {}}
                    redo={() => {}}
                    canUndo={false}
                    canRedo={false}
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
                        addNewPage={handleAddPage}
                        duplicatePage={handleDuplicatePage}
                        deletePage={handleDeletePage}
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
            />
        </div>
    );
}
