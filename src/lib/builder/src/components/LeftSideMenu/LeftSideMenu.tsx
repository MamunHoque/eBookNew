"use client";

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Element } from '../../types';
import MainMenu from './MainMenu';
import SubMenu from './SubMenu';
import TextMenu from './TextMenu';
import { categories, textCategory } from './menuData';

interface LeftSideMenuProps {
  addElement: (element: Element) => void;
  setTemplateContent: (content: string) => void;
  isCanvasEmpty: boolean;
  canvasSize: { width: number; height: number };
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({
  addElement,
  setTemplateContent,
  isCanvasEmpty,
  canvasSize,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryName ? null : categoryName
    );
  };

  const renderSubMenu = () => {
    if (!selectedCategory) return null;

    if (selectedCategory === 'Text') {
      return <TextMenu
          addElement={addElement}
          onClose={() => setSelectedCategory(null)}
      />;
    }

    const category = categories.find(c => c.name === selectedCategory);
    if (!category) return null;

    return (
      <SubMenu
        category={category}
        onClose={() => setSelectedCategory(null)}
        addElement={addElement}
        setTemplateContent={setTemplateContent}
        isCanvasEmpty={isCanvasEmpty}
        canvasSize={canvasSize}
      />
    );
  };

  const allCategories = [...categories, textCategory];

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="w-16 h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center h-14 border-b border-gray-200 dark:border-gray-700">
          <FileText size={32} className="text-blue-500" />
        </div>
        <MainMenu
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      {renderSubMenu()}
    </div>
  );
};

export default LeftSideMenu;