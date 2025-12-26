"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  selectedCategories: string[]; // category IDs
  onCategoryChange: (categoryID: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategories,
  onCategoryChange,
}) => {
  const t = useTranslations("sidebar");
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
      setCreateErrorMessage(t("categoryExists"));
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
      setEditErrorMessage(t("categoryExists"));
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
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-6 fixed h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("categories")}
          </h2>
          <button
            onClick={toggleEditMode}
            className={`p-2 rounded-lg transition-all ${
              isEditMode
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
            title={isEditMode ? t("closeEditMode") : t("editCategories")}
          >
            {isEditMode ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <PencilIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* -------- ADD CATEGORY -------- */}
      {isEditMode && (
        <div className="mb-6  ">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("enterCategoryName")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCategory();
              }
            }}
            error={createErrorMessage}
          />
          <Button
            onClick={handleAddCategory}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("addCategory")}
          </Button>
        </div>
      )}

      {/* -------- CATEGORY LIST -------- */}
      <div className="space-y-2">
        {allCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t("noCategories")}
          </div>
        ) : (
          allCategories.map((category) => (
            <div
              key={category.id}
              className={`group relative rounded-lg transition-all ${
                editingcategoryID === category.id
                  ? "bg-blue-50 border-2 border-blue-200 p-3"
                  : "hover:bg-gray-50 p-2"
              }`}
            >
              {editingcategoryID === category.id ? (
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          setEditingcategoryID(null);
                          setEditErrorMessage("");
                        }
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handleSaveEdit}
                        title={t("save")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingcategoryID(null);
                          setEditErrorMessage("");
                        }}
                        title={t("cancel")}
                        className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editErrorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="text-red-600 text-xs">{editErrorMessage}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onCategoryChange(category.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        selectedCategories.includes(category.id)
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {category.title}
                    </span>
                  </label>

                  {isEditMode && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditCategory(category)}
                        title={t("edit")}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        title={t("delete")}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
