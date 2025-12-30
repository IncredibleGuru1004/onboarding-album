import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategoryThunk,
  deleteCategoryThunk,
  selectCategories,
  selectCurrentCategory,
  selectCategoriesLoading,
  selectCategoriesError,
  clearError,
  clearCurrentCategory,
} from "@/store/categorySlice";
import { CreateCategoryDto, UpdateCategoryDto } from "@/types/category";

/**
 * Hook for managing categories
 * Provides access to category state and actions
 */
export function useCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const currentCategory = useSelector(selectCurrentCategory);
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  /**
   * Fetch all categories
   */
  const loadCategories = async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load categories:", error);
      return false;
    }
  };

  /**
   * Fetch a single category by ID
   */
  const loadCategoryById = async (id: string) => {
    try {
      await dispatch(fetchCategoryById(id)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load category:", error);
      return false;
    }
  };

  /**
   * Create a new category
   */
  const addCategory = async (data: CreateCategoryDto) => {
    try {
      const result = await dispatch(createCategory(data)).unwrap();
      return result;
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (id: string, data: UpdateCategoryDto) => {
    try {
      const result = await dispatch(updateCategoryThunk({ id, data })).unwrap();
      return result;
    } catch (error) {
      console.error("Failed to update category:", error);
      throw error;
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: string) => {
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  };

  /**
   * Clear any error messages
   */
  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  /**
   * Clear the current category
   */
  const clearCurrent = () => {
    dispatch(clearCurrentCategory());
  };

  /**
   * Get a category by ID from the current state
   */
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id) || null;
  };

  return {
    // State
    categories,
    currentCategory,
    isLoading,
    error,

    // Actions
    loadCategories,
    loadCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    clearErrorMessage,
    clearCurrent,
    getCategoryById,
  };
}
