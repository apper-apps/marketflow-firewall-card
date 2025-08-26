import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AllProductsPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  });
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Get search query and category from URL
  const searchQuery = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  // Update filters based on URL parameters
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== "all") {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [categoryFromUrl]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryFromUrl && categoryFromUrl !== "all") {
      return `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Products`;
    }
    return "Shop All Products";
  };

  const getPageDescription = () => {
    if (searchQuery) return `Found products matching "${searchQuery}"`;
    if (categoryFromUrl && categoryFromUrl !== "all") {
      return `Browse our ${categoryFromUrl.toLowerCase()} collection`;
    }
    return "Discover our full collection of premium products";
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 text-lg">
                {getPageDescription()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ApperIcon
                  name="ChevronDown"
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>

              {/* Filter Button - Mobile */}
              <Button
                variant="outline"
                onClick={() => setIsFilterSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2"
              >
                <ApperIcon name="Filter" size={18} />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                isOpen={false}
                onClose={() => {}}
              />
            </div>
          </div>

          {/* Filter Sidebar - Mobile */}
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              filters={filters}
              sortBy={sortBy}
              searchQuery={searchQuery}
              pageType="shop"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;