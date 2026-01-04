"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
// TODO: Re-enable category management features later - uncomment these imports when needed
// import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { Category } from "@/types/category";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { openCategoryModal } from "@/store/categorySlice";
// import { Button } from "@/components/ui/Button";
// import { openConfirmDialog } from "@/store/uiSlice";
import { getImageUrl } from "@/lib/imageUtils";

interface SidebarProps {
  selectedCategories: string[]; // category IDs
  onCategoryChange: (categoryID: string) => void;
  isMobileMenuOpen?: boolean; // Control visibility on mobile
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategories,
  onCategoryChange,
  isMobileMenuOpen = false,
}) => {
  const t = useTranslations("sidebar");
  // const dispatch = useDispatch<AppDispatch>();
  const allCategories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  // TODO: Re-enable category management features later
  // const [isEditMode, setIsEditMode] = useState(false);
  const [categoryImageUrls, setCategoryImageUrls] = useState<
    Record<string, string>
  >({});

  // Fetch image URLs for categories
  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls: Record<string, string> = {};
      await Promise.all(
        allCategories.map(async (category) => {
          if (category.image) {
            try {
              const url = await getImageUrl(
                category.image,
                category.imageUrl || undefined,
              );
              urls[category.id] = url;
            } catch (error) {
              console.error(
                `Failed to get image URL for category ${category.id}:`,
                error,
              );
            }
          }
        }),
      );
      setCategoryImageUrls(urls);
    };

    if (allCategories.length > 0) {
      fetchImageUrls();
    }
  }, [allCategories]);

  /* ---------------- ADD CATEGORY ---------------- */
  // TODO: Re-enable category management features later
  // const handleAddCategory = () => {
  //   dispatch(openCategoryModal({ mode: "add" }));
  // };

  /* ---------------- EDIT CATEGORY ---------------- */
  // TODO: Re-enable category management features later
  // const handleEditCategory = (category: Category) => {
  //   dispatch(openCategoryModal({ mode: "edit", category }));
  // };

  /* ---------------- DELETE CATEGORY ---------------- */
  // TODO: Re-enable category management features later
  // const handleDeleteCategory = (categoryID: string) => {
  //   dispatch(
  //     openConfirmDialog({
  //       title: t("confirmDeleteTitle") || "Delete Category",
  //       message:
  //         t("confirmDeleteMessage") ||
  //         "Are you sure you want to delete this category? This action cannot be undone.",
  //       confirmText: t("confirmDeleteButton") || "Delete",
  //       cancelText: t("cancel") || "Cancel",
  //       type: "category",
  //       id: categoryID,
  //     }),
  //   );
  // };

  /* ---------------- TOGGLE EDIT MODE ---------------- */
  // TODO: Re-enable category management features later
  // const toggleEditMode = () => {
  //   setIsEditMode((prev) => !prev);
  // };

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 shadow-sm p-6 fixed h-full overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
        isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      } md:block z-30`}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("categories")}
          </h2>
          {/* Edit mode toggle button hidden - TODO: Re-enable category management features later */}
          {/* <button
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
          </button> */}
        </div>
      </div>

      {/* -------- ADD CATEGORY BUTTON -------- */}
      {/* Add category button hidden - TODO: Re-enable category management features later */}
      {/* {isEditMode && (
        <div className="mb-6">
          <Button
            onClick={handleAddCategory}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("addCategory") || "Add Category"}
          </Button>
        </div>
      )} */}

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
              className="group relative rounded-lg transition-all hover:bg-gray-50 p-2"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all shrink-0"
                  />
                  {/* Category Image Thumbnail */}
                  {categoryImageUrls[category.id] ? (
                    <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={categoryImageUrls[category.id]}
                        alt={category.title}
                        className="w-full h-full object-cover"
                        onError={() => {
                          // Remove failed image URL
                          setCategoryImageUrls((prev) => {
                            const newUrls = { ...prev };
                            delete newUrls[category.id];
                            return newUrls;
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-gray-200 shrink-0 flex items-center justify-center">
                      <span className="text-xs text-gray-400">
                        {category.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium transition-colors truncate ${
                        selectedCategories.includes(category.id)
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {category.title}
                    </span>
                    {category.auctionCount !== undefined &&
                      category.auctionCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full shrink-0">
                          {category.auctionCount}
                        </span>
                      )}
                  </div>
                </label>

                {/* Edit and delete buttons hidden - TODO: Re-enable category management features later */}
                {/* {isEditMode && (
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
                )} */}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
