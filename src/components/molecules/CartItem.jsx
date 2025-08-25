import React from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CartItem = ({ item, product, onUpdateQuantity, onRemove, onSaveForLater }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.productId);
    toast.success("Item removed from cart");
  };

  const handleSaveForLater = () => {
    onSaveForLater(item.productId);
    toast.info("Item saved for later");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (!product) return null;

  const itemTotal = product.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-4 mb-2">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={handleSaveForLater}
            className="text-secondary hover:text-secondary/80 transition-colors"
          >
            Save for later
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleRemove}
            className="text-error hover:text-error/80 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={item.quantity <= 1}
          >
            <ApperIcon name="Minus" size={16} />
          </button>
          <span className="px-3 py-2 min-w-[3rem] text-center font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            disabled={item.quantity >= 10}
          >
            <ApperIcon name="Plus" size={16} />
          </button>
        </div>
        
        <div className="text-lg font-bold text-gray-900">
          {formatPrice(itemTotal)}
        </div>
      </div>
    </div>
  );
};

export default CartItem;