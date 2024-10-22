import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { Element, Page } from '../types';

interface CanvasElementProps {
    element: Element;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updatedElement: Element) => void;
    onDelete: (elementId: string) => void;
    canvasSize: { width: number; height: number };
    zoom: number;
    currentPage: number;
    pages: Page[];
    setPages: React.Dispatch<React.SetStateAction<Page[]>>;
}

const CanvasElement2: React.FC<CanvasElementProps> = ({
                                                         element,
                                                         isSelected,
                                                         onSelect,
                                                         onUpdate,
                                                         onDelete,
                                                         canvasSize,
                                                         zoom,
                                                         currentPage,
                                                         pages,
                                                         setPages
                                                     }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableContent, setEditableContent] = useState(element.content);
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

    useEffect(() => {
        setEditableContent(element.content);
    }, [element.content]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(elementRef.current!);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            const start = preSelectionRange.toString().length;

            setSelection({
                start: start,
                end: start + range.toString().length
            });
        }
    };

    const restoreSelection = () => {
        if (selection && elementRef.current) {
            const range = document.createRange();
            range.selectNodeContents(elementRef.current);
            const textNodes = getTextNodesIn(elementRef.current);
            let charCount = 0, endCharCount;
            let start = null, end = null;

            for (let i = 0; i < textNodes.length; i++) {
                endCharCount = charCount + textNodes[i].length;
                if (!start && selection.start >= charCount && selection.start <= endCharCount) {
                    start = [textNodes[i], selection.start - charCount];
                }
                if (!end && selection.end >= charCount && selection.end <= endCharCount) {
                    end = [textNodes[i], selection.end - charCount];
                    break;
                }
                charCount = endCharCount;
            }

            if (start && end) {
                range.setStart(start[0], start[1]);
                range.setEnd(end[0], end[1]);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }
    };

    const getTextNodesIn = (node: Node) => {
        var textNodes: Node[] = [];
        if (node.nodeType == 3) {
            textNodes.push(node);
        } else {
            var children = node.childNodes;
            for (var i = 0; i < children.length; ++i) {
                textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
            }
        }
        return textNodes;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isEditing) return;
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging && !isResizing) return;

        if (isDragging) {
            const dx = (e.clientX - dragStart.x) / zoom;
            const dy = (e.clientY - dragStart.y) / zoom;

            const newLeft = element.left + (dx / canvasSize.width) * 100;
            const newTop = element.top + (dy / canvasSize.height) * 100;

            onUpdate({
                ...element,
                left: Math.max(0, Math.min(newLeft, 100 - element.width)),
                top: Math.max(0, Math.min(newTop, 100 - element.height)),
            });

            setDragStart({ x: e.clientX, y: e.clientY });
        }

        if (isResizing) {
            const dx = (e.clientX - resizeStart.x) / zoom;
            const dy = (e.clientY - resizeStart.y) / zoom;

            const newWidth = element.width + (dx / canvasSize.width) * 100;
            const newHeight = element.height + (dy / canvasSize.height) * 100;

            onUpdate({
                ...element,
                width: Math.max(5, Math.min(newWidth, 100 - element.left)),
                height: Math.max(5, Math.min(newHeight, 100 - element.top)),
            });

            setResizeStart({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, isResizing, dragStart, resizeStart, zoom, element, onUpdate, canvasSize]);

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onUpdate({ ...element, content: editableContent });

        // Update the pages state
        const updatedPages = pages.map(page =>
            page.pageNumber === currentPage
                ? { ...page, content: JSON.stringify(JSON.parse(page.content).map((el: Element) =>
                        el.id === element.id ? { ...el, content: editableContent } : el
                    ))}
                : page
        );
        setPages(updatedPages);
    };

    const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
        saveSelection();
        setEditableContent(e.currentTarget.innerHTML);
        requestAnimationFrame(() => {
            restoreSelection();
        });
    };

    const handleDelete = () => {
        onDelete(element.id);
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSelected && e.key === 'Delete') {
                handleDelete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSelected]);

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${element.left}%`,
        top: `${element.top}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        zIndex: element.zIndex,
        border: isSelected ? '2px solid #3b82f6' : 'none',
        cursor: isDragging ? 'move' : 'default',
        padding: '5px',
        boxSizing: 'border-box',
        color: 'black',
        overflow: 'auto',
        ...element.style,
    };

    const resizeHandleStyle: React.CSSProperties = {
        position: 'absolute',
        width: '10px',
        height: '10px',
        background: '#3b82f6',
        right: '-5px',
        bottom: '-5px',
        cursor: 'se-resize',
    };

    return (
        <div
            ref={elementRef}
            style={style}
            className={`canvas-element ${isSelected ? 'selected' : ''}`}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
        >
            {isSelected && !isEditing && (
                <>
                    <button
                        onClick={handleDelete}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Delete element"
                    >
                        <Trash2 size={14} />
                    </button>
                    <div
                        style={resizeHandleStyle}
                        onMouseDown={handleResizeStart}
                    />
                </>
            )}

            <div
                contentEditable={isEditing}
                onBlur={handleBlur}
                onInput={handleChange}
                dangerouslySetInnerHTML={{ __html: editableContent }}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    cursor: isEditing ? 'text' : 'inherit',
                    userSelect: 'text',
                    pointerEvents: isEditing ? 'auto' : 'none',
                    textAlign: 'left',
                    direction: 'ltr',
                    unicodeBidi: 'normal',
                }}
            />
        </div>
    );
};

export default React.memo(CanvasElement2);