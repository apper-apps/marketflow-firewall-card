import React, { useState, useEffect } from "react";
import { productService } from "@/services/api/productService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ onFiltersChange, isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const loadCategories = async () => {
    try {
      const products = await productService.getAll();
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: [0, 1000],
      rating: 0,
      inStock: false
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== "all" ||
           filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ||
           filters.rating > 0 ||
           filters.inStock;
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg text-gray-900">
          Filters
        </h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-primary hover:text-primary/80"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === "all"}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-gray-700 capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => updateFilter("priceRange", [Number(e.target.value), filters.priceRange[1]])}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Minimum Rating</h4>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={(e) => updateFilter("rating", Number(e.target.value))}
                className="text-primary focus:ring-primary"
              />
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ApperIcon
                    key={star}
                    name="Star"
                    size={14}
                    className={star <= rating ? "text-accent fill-current" : "text-gray-300"}
                  />
                ))}
                <span className="text-gray-700 ml-1">
                  {rating === 0 ? "Any rating" : `${rating}+ stars`}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilter("inStock", e.target.checked)}
            className="text-primary focus:ring-primary rounded"
          />
          <span className="font-medium text-gray-900">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 max-w-[85vw] 
        bg-white shadow-xl lg:shadow-none border-r border-gray-200
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-display font-semibold text-lg text-gray-900">
                Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;