import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  });
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchQuery = searchParams.get("q") || "";
  
  // Determine page type from pathname
  const pageType = location.pathname === "/categories" ? "categories" 
                 : location.pathname === "/deals" ? "deals" 
                 : "shop";

  // Update filters based on page type
  useEffect(() => {
    if (pageType === "deals") {
      setFilters(prev => ({ ...prev, onSale: true }));
    } else if (pageType === "categories") {
      // Categories view will be handled by ProductGrid
    }
  }, [pageType]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "name", label: "Name A-Z" }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
};

  // Get page title based on type
  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (pageType === "categories") return "Browse Categories";
    if (pageType === "deals") return "Special Deals & Offers";
    return "Shop All Products";
  };

  const getPageDescription = () => {
    if (searchQuery) return `Found products matching "${searchQuery}"`;
    if (pageType === "categories") return "Explore our product categories";
    if (pageType === "deals") return "Don't miss out on these amazing deals";
    return "Discover our full collection of products";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 text-lg">
                {getPageDescription()}
              </p>
              <p className="text-gray-600">
                Discover amazing products at unbeatable prices
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden"
              >
                <ApperIcon name="Filter" size={18} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              onFiltersChange={handleFiltersChange}
              isOpen={false}
              onClose={() => {}}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1">
<ProductGrid
              filters={filters}
              sortBy={sortBy}
              searchQuery={searchQuery}
              pageType={pageType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;