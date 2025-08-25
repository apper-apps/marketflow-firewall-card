import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = true,
  ...props 
}, ref) => {
  const baseStyles = "bg-surface rounded-lg shadow-md border border-gray-100 transition-all duration-200";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        hover && "hover:shadow-xl hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;