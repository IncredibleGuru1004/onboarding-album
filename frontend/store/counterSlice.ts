import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  count: number;
  letter: string;
  buttonPressed: number;
}

const initialState: AppState = {
  count: 0,
  letter: "A",
  buttonPressed: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
    setLetter(state, action: PayloadAction<string>) {
      state.letter = action.payload;
    },
    pressButton(state) {
      state.buttonPressed += 1;
      state.count += 1;
    },
  },
});

export const { increment, decrement, setLetter, pressButton } =
  appSlice.actions;
export default appSlice.reducer;
