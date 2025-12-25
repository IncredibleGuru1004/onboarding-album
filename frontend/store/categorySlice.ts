import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/category";

interface CategoryState {
  categories: Category[];
}

const initialCategories: Category[] = [
  { id: "weapons", title: "Weapons" },
  { id: "skulls", title: "Skulls" },
  { id: "status", title: "Status" },
  { id: "keep", title: "Keep" },
  { id: "watches", title: "Watches" },
  { id: "furniture", title: "Furniture" },
];

const initialState: CategoryState = {
  categories: initialCategories,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    updateCategory(
      state,
      action: PayloadAction<{ id: string; title: string }>,
    ) {
      const category = state.categories.find((c) => c.id === action.payload.id);
      if (category) {
        category.title = action.payload.title;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload,
      );
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { addCategory, updateCategory, deleteCategory, setCategories } =
  categorySlice.actions;
export default categorySlice.reducer;
