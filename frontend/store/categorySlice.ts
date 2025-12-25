import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types/category";

interface CategoryState {
  categories: Category[];
}

const initialCategories: Category[] = [
  { id: "nature", title: "Nature" },
  { id: "architecture", title: "Architecture" },
  { id: "portrait", title: "Portrait" },
  { id: "abstract", title: "Abstract" },
  { id: "landscape", title: "Landscape" },
  { id: "street", title: "Street" },
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
