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
        {isLoading ? "Loading..." : props.children}
      </button>
    );
  },
);

Button.displayName = "Button";
