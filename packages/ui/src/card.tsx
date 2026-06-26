"use client";

import * as React from "react";
import { cn } from "./lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children }, ref) => {
    return (
      <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden",
        className
      )}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
);
export const CardTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
);
export const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);
