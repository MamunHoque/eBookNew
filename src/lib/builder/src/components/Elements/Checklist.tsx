import React, { useState } from 'react';

interface ChecklistProps {
  initialItems?: string[];
}

const Checklist: React.FC<ChecklistProps> = ({ initialItems = ['Item 1', 'Item 2', 'Item 3'] }) => {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="checklist-element">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input type="checkbox" id={`item-${index}`} />
            <label htmlFor={`item-${index}`}>{item}</label>
            <button onClick={() => removeItem(index)} className="text-red-500">×</button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="New item"
        />
        <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
      </div>
    </div>
  );
};

export default Checklist;