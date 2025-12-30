import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

// Async thunks for API calls

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch categories");
      }

      const data = await response.json();
      return data as Category[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Fetch single category by ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch category");
      }

      const data = await response.json();
      return data as Category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Create a new category
export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData: CreateCategoryDto, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to create category");
      }

      const data = await response.json();
      return data as Category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Update a category
export const updateCategoryThunk = createAsyncThunk(
  "categories/update",
  async (
    { id, data }: { id: string; data: UpdateCategoryDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update category");
      }

      const responseData = await response.json();
      return responseData as Category;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Delete a category
export const deleteCategoryThunk = createAsyncThunk(
  "categories/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok && response.status !== 204) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to delete category");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Synchronous actions for manual state updates if needed
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single category
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update category
    builder
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete category
    builder
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCategories, clearError, clearCurrentCategory } =
  categorySlice.actions;

// Selectors
export const selectCategories = (state: RootState) =>
  state.categories.categories;
export const selectCurrentCategory = (state: RootState) =>
  state.categories.currentCategory;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.isLoading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;

export default categorySlice.reducer;
