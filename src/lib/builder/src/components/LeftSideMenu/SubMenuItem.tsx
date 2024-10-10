import React from 'react';
import { Element } from '../../types';
import { Category } from './menuData';
import ConfirmationModal from '../ConfirmationModal';

interface SubMenuItemProps {
  item: any;
  category: Category;
  addElement: (element: Element) => void;
  setTemplateContent: (content: string) => void;
  isCanvasEmpty: boolean;
  canvasSize: { width: number; height: number };
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ 
  item, 
  category, 
  addElement, 
  setTemplateContent, 
  isCanvasEmpty,
  canvasSize
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleItemClick = () => {
    if (category.name === 'Templates') {
      if (isCanvasEmpty) {
        setTemplateContent(item.content);
      } else {
        setIsModalOpen(true);
      }
    } else {
      const elementType = typeof item === 'string' ? item : item.name;
      const content = getElementContent(elementType);
      addElement({
        id: Date.now().toString(),
        type: elementType,
        content: content,
        left: 10,
        top: 10,
        width: 20,
        height: 10,
        zIndex: 1,
      });
    }
  };

  const handleConfirm = () => {
    setTemplateContent(item.content);
  };

  const getElementContent = (elementType: string) => {
    // ... (keep the existing switch statement)
  };

  const getIcon = (itemName: string) => {
    // ... (keep the existing switch statement)
  };

  if (category.name === 'Templates') {
    return (
      <>
        <div 
          className="cursor-pointer hover:opacity-75 transition-opacity"
          onClick={handleItemClick}
        >
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-auto rounded-md shadow-md"
          />
          <p className="mt-2 text-sm text-center text-gray-800 dark:text-gray-200">{item.name}</p>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          message="This will replace your current content. Are you sure you want to continue?"
        />
      </>
    );
  }

  return (
    <div
      className="w-full py-3 px-4 flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="text-gray-600 dark:text-gray-300">
        {getIcon(typeof item === 'string' ? item : item.name)}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {typeof item === 'string' ? item : item.name}
      </span>
    </div>
  );
};

export default SubMenuItem;