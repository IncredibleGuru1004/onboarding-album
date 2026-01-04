"use client";

import { useMemo, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { RootState, AppDispatch } from "@/store/store";
import { useCategories } from "@/hooks/useCategories";
import { selectCategoryModal, closeCategoryModal } from "@/store/categorySlice";
import { useModalFormReset, useModalCloseHandler } from "@/hooks/useModal";
import { BaseModal } from "@/components/ui/BaseModal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { toast } from "react-toastify";
import {
  validateRequired,
  validateUniqueCategoryName,
  combineValidations,
} from "@/utils/validation";

interface CategoryFormData {
  title: string;
  image: string;
}

const initialFormData: CategoryFormData = {
  title: "",
  image: "",
};

/**
 * Category modal component for creating and editing categories
 * Uses Redux for state management and follows senior-level patterns
 */
export default function CategoryModal() {
  const t = useTranslations("sidebar");
  const dispatch = useDispatch<AppDispatch>();
  const { addCategory, updateCategory, isLoading } = useCategories();
  const modal = useSelector(selectCategoryModal);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [error, setError] = useState<string>("");

  const isOpen = modal.isOpen;
  const isEditMode = modal.mode === "edit";
  const editingCategory = modal.editingCategory;

  // Memoized values
  const modalTitle = useMemo(
    () =>
      isEditMode
        ? t("editCategory") || "Edit Category"
        : t("addCategory") || "Add Category",
    [isEditMode, t],
  );

  const modalDescription = useMemo(
    () =>
      isEditMode
        ? t("editCategoryDesc") || "Update the category details below"
        : t("addCategoryDesc") ||
          "Fill in the details below to create a new category",
    [isEditMode, t],
  );

  // Initialize form when modal opens
  useModalFormReset(isOpen, () => {
    if (isEditMode && editingCategory) {
      setFormData({
        title: editingCategory.title,
        image: editingCategory.image || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setError("");
  }, [isEditMode, editingCategory?.id]);

  // Close handler with error clearing
  const handleClose = useModalCloseHandler(
    () => dispatch(closeCategoryModal()),
    () => setError(""),
  );

  // Form field handlers
  const handleTitleChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, title: value }));
      if (error) setError("");
    },
    [error],
  );

  const handleImageChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, image: value }));
      if (error) setError("");
    },
    [error],
  );

  // Validation
  const validateForm = useCallback((): boolean => {
    const titleValidation = validateRequired(
      formData.title,
      t("categoryName") || "Category Name",
    );

    const uniquenessValidation = validateUniqueCategoryName(
      formData.title,
      categories,
      editingCategory?.id,
    );

    const combined = combineValidations(titleValidation, uniquenessValidation);

    if (!combined.isValid) {
      setError(combined.error || t("categoryExists"));
      return false;
    }

    return true;
  }, [formData.title, categories, editingCategory?.id, t]);

  // Submit handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        const categoryData = {
          title: formData.title.trim(),
          image: formData.image || undefined,
        };

        if (isEditMode && editingCategory) {
          await updateCategory(editingCategory.id, categoryData);
          toast.success(
            t("categoryUpdated") || "Category updated successfully!",
          );
        } else {
          await addCategory(categoryData);
          toast.success(
            t("categoryCreated") || "Category created successfully!",
          );
        }

        handleClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save category";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [
      formData,
      isEditMode,
      editingCategory,
      validateForm,
      updateCategory,
      addCategory,
      handleClose,
      t,
    ],
  );

  const submitButtonText = useMemo(() => {
    if (isLoading) {
      return t("saving") || "Saving...";
    }
    return isEditMode
      ? t("save") || "Save"
      : t("addCategory") || "Add Category";
  }, [isLoading, isEditMode, t]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeButtonAriaLabel={t("closeModal") || "Close modal"}
    >
      <div className="p-8">
        <ModalHeader title={modalTitle} description={modalDescription} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label={t("categoryName") || "Category Name"}
            placeholder={t("enterCategoryName") || "Enter category name"}
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            error={
              error && !formData.title
                ? t("categoryName") + " is required"
                : undefined
            }
            autoFocus
          />

          <ImageUpload
            label={t("categoryImage") || "Category Image"}
            value={formData.image}
            onChange={handleImageChange}
            required={false}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <ModalFooter
            onCancel={handleClose}
            onConfirm={handleSubmit}
            cancelText={t("cancel") || "Cancel"}
            confirmText={submitButtonText}
            isLoading={isLoading}
          />
        </form>
      </div>
    </BaseModal>
  );
}
