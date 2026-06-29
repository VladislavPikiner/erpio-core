"use client";

import * as React from "react";
import { cn } from "./lib/utils";

// Используем компонент Button из shadcn/ui через @/components/ui/button
// Для совместимости с проектом @erpio/admin

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
      primary: "bg-emerald-600 text-white hover:bg-emerald-700",
      outline: "bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      default: "px-4 py-2",
      sm: "px-3 py-1 text-sm",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
