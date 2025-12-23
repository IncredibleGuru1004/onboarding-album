import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = "md", isLoading = false, className = "", ...props }, ref) => {
    const baseStyles =
      "font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeStyles = {
      sm: "px-3 py-1 text-sm",
      md: "px-[24px] py-[16px] text-[14px]",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? "Loading..." : props.children}
      </button>
    );
  },
);

Button.displayName = "Button";
