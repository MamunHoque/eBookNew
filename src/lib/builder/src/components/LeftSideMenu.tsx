import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Type, Image, Square, LineChart, Map, Layout, Shapes, FileText, X, Search } from 'lucide-react';
import { Element } from '../types';
import templates from '../data/templates.json';

interface LeftSideMenuProps {
  addElement: (element: Element) => void;
  setTemplateContent: (content: string) => void;
}

const LeftSideMenu: React.FC<LeftSideMenuProps> = ({ addElement, setTemplateContent }) => {
  const [isSubmenuExpanded, setIsSubmenuExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const categories = [
    { name: 'Templates', icon: Layout, subItems: templates.map(t => t.name) },
    { name: 'Elements', icon: Square, subItems: ['Buttons', 'Forms', 'Cards'] },
    { name: 'Text', icon: Type, subItems: ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6', 'Paragraph', 'Blockquote', 'Ordered List', 'Unordered List', 'Definition List', 'Pre', 'Code'] },
    { name: 'Shapes & Lines', icon: Square, subItems: ['Rectangle', 'Circle', 'Line', 'Arrow'] },
    { name: 'Icons', icon: Shapes, subItems: ['Social', 'Weather', 'Arrows', 'Devices'] },
    { name: 'Images', icon: Image, subItems: ['Upload', 'Gallery', 'Backgrounds'] },
    { name: 'Charts', icon: LineChart, subItems: ['Bar', 'Line', 'Pie', 'Scatter'] },
    { name: 'Maps', icon: Map, subItems: ['World', 'Country', 'City'] },
  ];

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) {
        setFilteredItems(
          category.subItems.filter(item =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }
  }, [selectedCategory, searchTerm]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setIsSubmenuExpanded(!isSubmenuExpanded);
    } else {
      setSelectedCategory(categoryName);
      setIsSubmenuExpanded(true);
      setSearchTerm('');
    }
  };

  const handleSubItemClick = (subItem: string) => {
    console.log(`Adding ${subItem} to canvas`);
    if (selectedCategory === 'Templates') {
      const template = templates.find(t => t.name === subItem);
      if (template) {
        setTemplateContent(template.content);
      }
    } else {
      const newElement: Element = {
        id: Date.now().toString(),
        type: 'text',
        content: getDefaultContent(subItem),
        left: 50,
        top: 50,
        width: 200,
        height: 50,
        zIndex: 1,
      };
      addElement(newElement);
    }
  };

  const getDefaultContent = (subItem: string) => {
    switch (subItem) {
      case 'Heading 1': return '<h1>Heading 1</h1>';
      case 'Heading 2': return '<h2>Heading 2</h2>';
      case 'Heading 3': return '<h3>Heading 3</h3>';
      case 'Heading 4': return '<h4>Heading 4</h4>';
      case 'Heading 5': return '<h5>Heading 5</h5>';
      case 'Heading 6': return '<h6>Heading 6</h6>';
      case 'Paragraph': return '<p>Paragraph text</p>';
      case 'Blockquote': return '<blockquote>Blockquote text</blockquote>';
      case 'Ordered List': return '<ol><li>First item</li><li>Second item</li></ol>';
      case 'Unordered List': return '<ul><li>First item</li><li>Second item</li></ul>';
      case 'Definition List': return '<dl><dt>Term</dt><dd>Definition</dd></dl>';
      case 'Pre': return '<pre>Preformatted text</pre>';
      case 'Code': return '<code>Code snippet</code>';
      default: return subItem;
    }
  };

  const closeSubmenu = () => {
    setIsSubmenuExpanded(false);
    setSelectedCategory(null);
    setSearchTerm('');
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="w-16 h-full flex flex-col">
        <div className="flex justify-center items-center h-14 border-b border-gray-200 dark:border-gray-700">
          <FileText size={24} className="text-blue-500" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedCategory === category.name ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <category.icon size={24} className="mx-auto text-gray-600 dark:text-gray-300" />
            </button>
          ))}
        </div>
      </div>
      {isSubmenuExpanded && selectedCategory && (
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">{selectedCategory}</h3>
            <button 
              onClick={closeSubmenu}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-8 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <Search size={16} className="absolute left-2 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredItems.map((subItem) => (
                <button
                  key={subItem}
                  className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSubItemClick(subItem)}
                >
                  <span className="text-sm font-medium">{subItem}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSideMenu;