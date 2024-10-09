import React from 'react';
import { Category } from './menuData';

interface MainMenuProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ categories, selectedCategory, onCategoryClick }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            selectedCategory === category.name ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          onClick={() => onCategoryClick(category.name)}
        >
          <category.icon size={24} className="mx-auto text-gray-600 dark:text-gray-300" />
        </button>
      ))}
    </div>
  );
};

export default MainMenu;