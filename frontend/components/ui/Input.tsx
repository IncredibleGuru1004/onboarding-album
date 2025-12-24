import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = "", id, name, required, rightIcon, ...props },
    ref,
  ) => {
    const hasError = !!error;
    const inputId = id ?? name;
    const errorId = hasError && inputId ? `${inputId}-error` : undefined;

    return (
      <div className="w-full space-y-1">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        {/* Input with optional right icon */}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              rightIcon ? "pr-12" : ""
            } ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            } ${className}`}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={errorId}
            onInvalid={(e) => {
              e.preventDefault();
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message with Heroicon */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-red-600 mt-1 flex items-center gap-1"
          >
            <ExclamationCircleIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
