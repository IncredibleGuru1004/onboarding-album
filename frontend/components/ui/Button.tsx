import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: "solid" | "outlined"; // Added variant prop for outline style
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, className = "", variant = "solid", ...props }, ref) => {
    const baseStyles =
      "font-medium rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-[24px] py-[16px] text-[14px] font-inter";

    // Added styles for outlined variant
    const variantStyles = {
      solid: "text-white border-none",
      outlined: "bg-transparent border-2 ", // outline styles
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {props.children}
          </span>
        ) : (
          props.children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
