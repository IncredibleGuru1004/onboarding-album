"use client";
import React, { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Category } from "@/types/category";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/store/categorySlice";

interface SidebarProps {
  selectedCategories: string[]; // category IDs
  onCategoryChange: (categoryID: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const [newCategory, setNewCategory] = useState("");
  const [editingcategoryID, setEditingcategoryID] = useState<string | null>(
    null,
  );
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  /* ---------------- ADD CATEGORY ---------------- */
  const handleAddCategory = () => {
    setCreateErrorMessage("");
    setEditErrorMessage("");

    const value = newCategory.trim();
    if (!value) return;

    const exists = allCategories.some(
      (c) => c.title.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setCreateErrorMessage("Category name already exists.");
      return;
    }

    dispatch(
      addCategory({
        id: crypto.randomUUID(),
        title: value,
      }),
    );

    setNewCategory("");
    setEditingcategoryID(null);
  };

  /* ---------------- EDIT CATEGORY ---------------- */
  const handleEditCategory = (category: Category) => {
    setCreateErrorMessage("");
    setEditErrorMessage("");
    setEditingcategoryID(category.id);
    setEditedCategoryName(category.title);
  };

  const handleSaveEdit = () => {
    if (!editingcategoryID) return;

    const value = editedCategoryName.trim();
    if (!value) return;

    const exists = allCategories.some(
      (c) =>
        c.title.toLowerCase() === value.toLowerCase() &&
        c.id !== editingcategoryID,
    );

    if (exists) {
      setEditErrorMessage("Category name already exists.");
      return;
    }

    dispatch(updateCategory({ id: editingcategoryID, title: value }));
    setEditingcategoryID(null);
  };

  /* ---------------- DELETE CATEGORY ---------------- */
  const handleDeleteCategory = (categoryID: string) => {
    dispatch(deleteCategory(categoryID));
  };

  /* ---------------- TOGGLE EDIT MODE ---------------- */
  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    setEditingcategoryID(null);
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

      {/* -------- ADD CATEGORY -------- */}
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
          <div key={category.id} className="flex items-center justify-between">
            {editingcategoryID === category.id ? (
              <div className="w-full">
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />

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
                        setEditingcategoryID(null);
                        setEditErrorMessage("");
                      }}
                      title="Cancel"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {editErrorMessage && (
                  <p className="text-red-600 text-sm mt-2">
                    {editErrorMessage}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-gray-700">{category.title}</span>
                </div>

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
                      onClick={() => handleDeleteCategory(category.id)}
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
