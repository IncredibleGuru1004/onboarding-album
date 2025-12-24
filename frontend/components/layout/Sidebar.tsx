import React from "react";

interface SidebarProps {
  allCategories: string[];
  selectedCategories: string[];
  newCategory: string;
  onCategoryChange: (category: string) => void;
  onAddCategory: () => void;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  allCategories,
  selectedCategories,
  newCategory,
  onCategoryChange,
  onAddCategory,
  setNewCategory,
}) => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 fixed h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter new category"
        />
        <button
          onClick={onAddCategory}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-3">
        {allCategories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
