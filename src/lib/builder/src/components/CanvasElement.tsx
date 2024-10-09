import React, { useState, useEffect, useRef } from 'react';
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
  const elementRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setEditableContent(element.content);
  }, [element.content]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

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
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, zoom, canvasSize]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ ...element, content: editableContent });
  };

  const handleChange = (e: React.FormEvent<HTMLElement>) => {
    setEditableContent(e.currentTarget.innerHTML);
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.left}%`,
    top: `${element.top}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: element.zIndex,
    border: isSelected ? '2px solid #3b82f6' : 'none',
    cursor: 'move',
    padding: '5px',
    boxSizing: 'border-box',
    color: 'black', // Ensure text is black for contrast
    ...element.style,
  };

  const Tag = element.type as keyof JSX.IntrinsicElements;

  return (
    <Tag
      ref={elementRef}
      style={style}
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      contentEditable={isEditing}
      onBlur={handleBlur}
      onInput={handleChange}
      dangerouslySetInnerHTML={{ __html: isEditing ? editableContent : element.content }}
    />
  );
};

export default React.memo(CanvasElement);