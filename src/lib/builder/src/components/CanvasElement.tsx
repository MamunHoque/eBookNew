import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { Element } from '../types';

interface CanvasElementProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updatedElement: Element) => void;
  onDelete: (elementId: string) => void;
  canvasSize: { width: number; height: number };
  zoom: number;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
                                                       element,
                                                       isSelected,
                                                       onSelect,
                                                       onUpdate,
                                                       onDelete,
                                                       canvasSize,
                                                       zoom
                                                     }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(element.content);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setEditableContent(element.content);
  }, [element.content]);

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
  };

  const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
    setEditableContent(e.currentTarget.innerHTML);
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
              userSelect: 'text', // Allow proper text selection
              pointerEvents: isEditing ? 'auto' : 'none',
              textAlign: 'left', // Ensure left-to-right writing direction
              direction: 'ltr', // Set explicitly for left-to-right writing behavior
              unicodeBidi: 'normal', // Ensure correct bi-directional text behavior
            }}
        />
      </div>
  );
};

export default React.memo(CanvasElement);
