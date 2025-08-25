import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 bg-white";
  
  const states = {
    default: "border-gray-300 focus:border-primary focus:ring-primary/20",
    error: "border-error focus:border-error focus:ring-error/20"
  };

  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseStyles,
        error ? states.error : states.default,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;