import React from 'react';
import { Element } from '../../types';
import { Category } from './menuData';
import ConfirmationModal from '../ConfirmationModal';

interface SubMenuItem {
    name: string;
    imageUrl?: string;
    content?: string;
}

interface SubMenuItemProps {
    item: string | SubMenuItem;
    category: Category;
    addElement: (element: Element) => void;
    setTemplateContent: (content: string) => void;
    isCanvasEmpty: boolean;
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({
                                                     item,
                                                     category,
                                                     addElement,
                                                     setTemplateContent,
                                                     isCanvasEmpty
                                                 }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleItemClick = () => {
        if (category.name === 'Templates') {
            if (isCanvasEmpty) {
                setTemplateContent((item as SubMenuItem).content || '');
            } else {
                setIsModalOpen(true);
            }
        } else {
            const content = getElementContent(typeof item === 'string' ? item : item.name);
            addElement({
                id: Date.now().toString(),
                type: typeof item === 'string' ? item : item.name,
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
        setTemplateContent((item as SubMenuItem).content || '');
    };

    const getElementContent = (elementType: string) => {
        // Logic for content based on elementType
    };

    const getIcon = (item: string) => {
        // Logic for returning an icon based on item
    };

    if (category.name === 'Templates') {
        return (
            <>
                <div
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={handleItemClick}
                >
                    <img
                        src={(item as SubMenuItem).imageUrl || ''}
                        alt={(item as SubMenuItem).name}
                        className="w-full h-auto rounded-md shadow-md"
                    />
                    <p className="mt-2 text-sm text-center text-gray-800 dark:text-gray-200">{(item as SubMenuItem).name}</p>
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
