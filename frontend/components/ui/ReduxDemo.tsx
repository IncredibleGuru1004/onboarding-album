"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  increment,
  decrement,
  setLetter,
  pressButton,
} from "@/store/counterSlice";

export default function ReduxDemo() {
  const { count, letter, buttonPressed } = useSelector((s: RootState) => s.app);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="container mx-auto p-4 border rounded-md my-6">
      <h3 className="text-lg font-semibold mb-2">Redux Demo</h3>

      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>

        <div>
          Count: <strong>{count}</strong>
        </div>

        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => dispatch(increment())}
        >
          +
        </button>

        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => dispatch(pressButton())}
        >
          Press
        </button>
      </div>

      <div className="mt-3">
        <label className="mr-2">Letter:</label>
        <input
          className="border px-2 py-1"
          value={letter}
          onChange={(e) => dispatch(setLetter(e.target.value))}
        />
      </div>

      <div className="mt-2">Button pressed: {buttonPressed}</div>
    </div>
  );
}
