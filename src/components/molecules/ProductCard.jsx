import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" size={14} className="text-accent fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="StarHalf" size={14} className="text-accent fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card 
      className="cursor-pointer group overflow-hidden h-full flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {!product.inStock && (
          <Badge 
            variant="error" 
            className="absolute top-3 left-3"
          >
            Out of Stock
          </Badge>
        )}
        {product.discount && (
          <Badge 
            variant="success" 
            className="absolute top-3 right-3"
          >
            -{product.discount}%
          </Badge>
        )}
        
        {/* Quick Add Button - Shows on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-200"
          >
            <ApperIcon name="ShoppingCart" size={18} className="mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="shrink-0"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;