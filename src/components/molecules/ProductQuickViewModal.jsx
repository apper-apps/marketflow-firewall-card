import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { cartService } from "@/services/api/cartService";
import { wishlistService } from "@/services/api/wishlistService";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      checkWishlistStatus();
    }
  }, [product, isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const checkWishlistStatus = async () => {
    try {
      const wishlist = await wishlistService.getAll();
      setIsInWishlist(wishlist.some(item => item.productId === product.Id));
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(product.Id);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(product.Id);
        toast.success("Added to wishlist");
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await cartService.addItem(product.Id.toString(), quantity);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    onClose();
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

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh]">
              {/* Image Section */}
              <div className="p-6 bg-gray-50">
                <div className="space-y-4 h-full flex flex-col">
                  {/* Main Image */}
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 aspect-square rounded-xl overflow-hidden bg-white shadow-sm"
                  >
                    <img
                      src={product.images[selectedImage]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Thumbnail Gallery */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                            selectedImage === index
                              ? "border-primary shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 overflow-y-auto max-h-[90vh]">
                <div className="space-y-4">
                  {/* Category and Stock Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-primary border-primary">
                      {product.category}
                    </Badge>
                    {!product.inStock && (
                      <Badge variant="error">Out of Stock</Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="success">New</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-bold text-2xl text-gray-900 leading-tight">
                    {product.title}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="font-medium text-sm text-gray-900">{product.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.originalPrice && (
                      <Badge variant="success" className="text-xs">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <label className="font-medium text-gray-900 text-sm">Quantity:</label>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <ApperIcon name="Minus" size={14} />
                        </button>
                        <span className="px-3 py-2 min-w-[2.5rem] text-center font-medium text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={quantity >= 10 || !product.inStock}
                        >
                          <ApperIcon name="Plus" size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        disabled={!product.inStock || loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Adding...
                          </div>
                        ) : (
                          <>
                            <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={handleWishlistToggle}
                        className="px-3"
                      >
                        <ApperIcon
                          name="Heart"
                          size={16}
                          className={cn(
                            "transition-colors",
                            isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
                          )}
                        />
                      </Button>
                    </div>

                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      onClick={handleViewDetails}
                      className="w-full"
                    >
                      View Full Details
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>

                    {!product.inStock && (
                      <p className="text-error text-sm text-center">
                        This item is currently out of stock.
                      </p>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <ApperIcon name="Truck" size={14} className="text-secondary" />
                      <span>Free shipping</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <ApperIcon name="RefreshCw" size={14} className="text-success" />
                      <span>30-day returns</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <ApperIcon name="Shield" size={14} className="text-accent" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <ApperIcon name="Headphones" size={14} className="text-primary" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickViewModal;