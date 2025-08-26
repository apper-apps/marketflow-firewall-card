import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { wishlistService } from "@/services/api/wishlistService";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await wishlistService.getAll();
      setWishlistItems(items);
      
      if (items.length > 0) {
        const productPromises = items.map(item => 
          productService.getById(item.productId)
        );
        const products = await Promise.all(productPromises);
        setWishlistProducts(products);
      } else {
        setWishlistProducts([]);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart(product.Id, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.info("Removed from wishlist");
      await loadWishlist(); // Reload the wishlist
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleClearWishlist = async () => {
    try {
      await wishlistService.clearWishlist();
      toast.info("Wishlist cleared");
      setWishlistItems([]);
      setWishlistProducts([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  const handleMoveAllToCart = async () => {
    try {
      const promises = wishlistProducts.map(product => 
        cartService.addToCart(product.Id, 1)
      );
      await Promise.all(promises);
      toast.success(`Added ${wishlistProducts.length} items to cart!`);
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Failed to add items to cart");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWishlist} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          
          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="md"
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2"
              >
                <ApperIcon name="ShoppingCart" size={18} />
                Add All to Cart
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleClearWishlist}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={18} />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {wishlistProducts.length === 0 ? (
          <Empty
            icon="Heart"
            title="Your wishlist is empty"
            description="Save items you love for later. They'll appear here when you add them."
            actionLabel="Continue Shopping"
            actionLink="/shop"
          />
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.Id} className="relative">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.Id)}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 shadow-lg"
                    aria-label="Remove from wishlist"
                  >
                    <ApperIcon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Wishlist Summary
                  </h3>
                  <p className="text-gray-600">
                    Total value: {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(wishlistProducts.reduce((sum, product) => sum + product.price, 0))}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleMoveAllToCart}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="ShoppingCart" size={20} />
                    Add All to Cart
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;