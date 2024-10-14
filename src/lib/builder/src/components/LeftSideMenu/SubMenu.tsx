import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Element } from '../../types';
import { Category } from './menuData';
import SubMenuItem from './SubMenuItem';
import templates from '../../data/templates.json';

// Define the structure for templates
interface Template {
  name: string;
  // add other fields here if necessary
}

interface SubMenuProps {
  category: Category;
  onClose: () => void;
  addElement: (element: Element) => void;
  setTemplateContent: (content: string) => void;
  isCanvasEmpty: boolean;
  canvasSize: { width: number; height: number };
}

const SubMenu: React.FC<SubMenuProps> = ({
                                           category,
                                           onClose,
                                           addElement,
                                           setTemplateContent,
                                           isCanvasEmpty,
                                           canvasSize
                                         }) => {
  // Refine the type of filteredItems
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Template[] | string[]>(category.name === 'Templates' ? templates : category.subItems);

  useEffect(() => {
    if (category.name === 'Templates') {
      setFilteredItems(
          templates.filter((template) =>
              template.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    } else {
      setFilteredItems(
          category.subItems.filter((item) =>
              item.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
  }, [category, searchTerm]);

  return (
      <div className="w-64 h-full bg-white dark:bg-gray-800 flex flex-col shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{category.name}</h3>
          <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search size={16} className="absolute left-2 top-3 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className={category.name === 'Templates' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {filteredItems.map((item, index) => (
                <SubMenuItem
                    key={index}
                    item={item}
                    category={category}
                    addElement={addElement}
                    setTemplateContent={setTemplateContent}
                    isCanvasEmpty={isCanvasEmpty}
                    canvasSize={canvasSize}
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default SubMenu;
