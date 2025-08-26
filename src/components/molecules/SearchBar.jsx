import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search products...", className }) => {
  const [query, setQuery] = useState("");

const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Trigger search for any input change if onSearch is provided
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger search immediately on form submission (Enter key)
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary shadow-md"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <ApperIcon name="Search" size={20} className="text-gray-400" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;