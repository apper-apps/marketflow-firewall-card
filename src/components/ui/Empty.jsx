import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  description = "We couldn't find what you're looking for.", 
  actionLabel = "Browse Products",
  onAction,
  icon = "Package"
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      window.location.href = "/shop";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        
        <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        <Button
          variant="primary"
          onClick={handleAction}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="ShoppingBag" size={18} />
          <span>{actionLabel}</span>
        </Button>
      </div>
    </div>
  );
};

export default Empty;