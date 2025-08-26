import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import { wishlistService } from "@/services/api/wishlistService";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ filters, sortBy, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadProducts();
  }, []);

useEffect(() => {
    applyFiltersAndSort();
    loadWishlistStatus();
  }, [products, filters, sortBy, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };
const loadWishlistStatus = useCallback(async () => {
    try {
      const wishlist = await wishlistService.getAll();
      const wishlistProductIds = wishlist.map(item => item.productId);
      
      setFilteredProducts(prev => prev.map(product => ({
        ...product,
        isInWishlist: wishlistProductIds.includes(product.Id)
      })));
    } catch (error) {
      console.error("Error loading wishlist status:", error);
    }
  }, []);
const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      );
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply in stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return b.rating - a.rating;
          case "newest":
            return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
          case "name":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
}, [products, filters, sortBy, searchQuery]);

  const handleAddToCart = async (product) => {
    try {
      await cartService.addItem(product.Id.toString(), 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProducts} />;
  if (filteredProducts.length === 0) {
    return (
      <Empty
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
        actionLabel="Clear Filters"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <ApperIcon name="Grid3x3" size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <ApperIcon name="List" size={16} />
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.Id}
            variants={itemVariants}
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;