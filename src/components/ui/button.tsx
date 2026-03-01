import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50",
  secondary:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50",
  danger: "bg-danger-600 text-white hover:bg-danger-700 disabled:opacity-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded-btn font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${isLoading ? "cursor-wait" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {children}
    </button>
  );
}
