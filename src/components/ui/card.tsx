import type { HTMLAttributes } from "react";

type CardPadding = "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-card border border-gray-200 bg-white shadow-card ${paddingStyles[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
