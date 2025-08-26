import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const DealsPage = () => {
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    onSale: true // Always filter for sale items
  });
  const [sortBy, setSortBy] = useState("discount");
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const handleFiltersChange = (newFilters) => {
    // Ensure onSale filter is always true for deals page
    setFilters({ ...newFilters, onSale: true });
  };

  const sortOptions = [
    { value: "discount", label: "Biggest Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest Deals" },
    { value: "ending-soon", label: "Ending Soon" }
  ];

  const dealCategories = [
    {
      title: "Flash Deals",
      description: "Limited time offers that won't last long",
      icon: "Zap",
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "Weekly Specials",
      description: "Handpicked deals refreshed every week",
      icon: "Calendar",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      title: "Clearance Sale",
      description: "Last chance to grab these amazing deals",
      icon: "Tag",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Bundle Offers",
      description: "Save more when you buy together",
      icon: "Package",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-black/5 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <Badge 
              variant="secondary" 
              className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <ApperIcon name="Percent" size={16} className="mr-2" />
              Limited Time Offers
            </Badge>
            
            <h1 className="font-display font-bold text-4xl lg:text-6xl mb-6">
              Special Deals & Offers
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Don't miss out on these incredible savings! Discover premium products at unbeatable prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-white/80 text-lg">
                <ApperIcon name="Clock" size={20} className="mr-2" />
                Deals refresh daily
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="flex items-center text-white/80 text-lg">
                <ApperIcon name="Truck" size={20} className="mr-2" />
                Free shipping on orders $50+
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deal Categories */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
            Deal Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/20">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <ApperIcon name={category.icon} size={24} className="text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">
                All Deals
              </h2>
              <p className="text-gray-600">
                Discover amazing discounts on premium products
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
              searchQuery=""
              pageType="deals"
            />
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ApperIcon name="Mail" size={48} className="text-primary mx-auto mb-6" />
          <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">
            Never Miss a Deal
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals, flash sales, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="px-6 py-3">
              <ApperIcon name="Send" size={16} className="mr-2" />
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealsPage;