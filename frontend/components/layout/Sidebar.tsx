import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface SidebarProps {
  allCategories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onCategoryUpdate: (oldCategory: string, newCategory: string) => void;
  onCategoryDelete: (category: string) => void;
  setAllCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  allCategories,
  selectedCategories,
  onCategoryChange,
  onCategoryUpdate,
  onCategoryDelete,
  setAllCategories,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false); // Track if we are in edit mode

  /* ---------------- ADD CATEGORY ---------------- */
  const handleAddCategory = () => {
    setCreateErrorMessage("");
    setEditErrorMessage("");

    const value = newCategory.trim();
    if (!value) return;

    if (allCategories.includes(value)) {
      setCreateErrorMessage("Category name already exists.");
      return;
    }

    setAllCategories([...allCategories, value]);
    setNewCategory("");
    setEditingCategory(null);
  };

  /* ---------------- EDIT CATEGORY ---------------- */
  const handleEditCategory = (category: string) => {
    setCreateErrorMessage("");
    setEditErrorMessage("");
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const handleSaveEdit = () => {
    setEditErrorMessage("");

    if (!editingCategory) return;

    const value = editedCategoryName.trim();
    if (!value) return;

    if (allCategories.includes(value) && value !== editingCategory) {
      setEditErrorMessage("Category name already exists.");
      return;
    }

    onCategoryUpdate(editingCategory, value);
    setEditingCategory(null);
  };

  /* ---------------- DELETE CATEGORY ---------------- */
  const handleDeleteCategory = (category: string) => {
    onCategoryDelete(category);
    if (selectedCategories.includes(category)) {
      onCategoryChange(category);
    }
  };

  /* ---------------- TOGGLE EDIT MODE ---------------- */
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditingCategory(null); // Reset editing when exiting edit mode
    setEditErrorMessage("");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 fixed h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Categories
        <button
          onClick={toggleEditMode}
          className="text-blue-600 hover:text-blue-800"
          title={isEditMode ? "Close edit mode" : "Edit categories"}
        >
          {isEditMode ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <PencilIcon className="w-5 h-5" />
          )}
        </button>
      </h2>

      {/* -------- ADD CATEGORY (Visible only in edit mode) -------- */}
      {isEditMode && (
        <div className="mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <button
            onClick={handleAddCategory}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Category
          </button>

          {createErrorMessage && (
            <p className="text-red-600 text-sm mt-2">{createErrorMessage}</p>
          )}
        </div>
      )}

      {/* -------- CATEGORY LIST -------- */}
      <div className="space-y-3">
        {allCategories.map((category) => (
          <div key={category} className="flex items-center justify-between">
            {editingCategory === category ? (
              <div className="w-full">
                <div className="flex items-center gap-3 w-full">
                  {/* Input */}
                  <input
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />

                  {/* Actions (Visible only in edit mode) */}
                  {isEditMode && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleSaveEdit}
                        title="Save"
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setEditErrorMessage("");
                        }}
                        title="Cancel"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {editErrorMessage && (
                  <p className="text-red-600 text-sm mt-2">
                    {editErrorMessage}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                {/* Left */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryChange(category)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-gray-700">{category}</span>
                </div>

                {/* Right (Visible only in edit mode) */}
                {isEditMode && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditCategory(category)}
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(category)}
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
