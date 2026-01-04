import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: "category" | "auction" | null;
  id: string | number | null;
}

interface UIState {
  confirmDialog: ConfirmDialogState;
}

const initialState: UIState = {
  confirmDialog: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: null,
    id: null,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openConfirmDialog: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type: "category" | "auction";
        id: string | number;
      }>,
    ) => {
      state.confirmDialog.isOpen = true;
      state.confirmDialog.title = action.payload.title;
      state.confirmDialog.message = action.payload.message;
      state.confirmDialog.confirmText = action.payload.confirmText || "Delete";
      state.confirmDialog.cancelText = action.payload.cancelText || "Cancel";
      state.confirmDialog.type = action.payload.type;
      state.confirmDialog.id = action.payload.id;
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog.isOpen = false;
      state.confirmDialog.title = "";
      state.confirmDialog.message = "";
      state.confirmDialog.confirmText = "Delete";
      state.confirmDialog.cancelText = "Cancel";
      state.confirmDialog.type = null;
      state.confirmDialog.id = null;
    },
  },
});

export const { openConfirmDialog, closeConfirmDialog } = uiSlice.actions;

// Selectors
export const selectConfirmDialog = (state: RootState) => state.ui.confirmDialog;

export default uiSlice.reducer;
