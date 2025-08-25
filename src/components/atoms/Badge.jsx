import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "sm", 
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white shadow-md",
    secondary: "bg-gradient-to-r from-secondary to-blue-600 text-white shadow-md",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-md",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white shadow-md",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-md",
    outline: "border-2 border-primary text-primary bg-white"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs min-w-[16px] h-4",
    sm: "px-2.5 py-1 text-xs min-w-[20px] h-5",
    md: "px-3 py-1.5 text-sm min-w-[24px] h-6",
    lg: "px-4 py-2 text-base min-w-[28px] h-7"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;