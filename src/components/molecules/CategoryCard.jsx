import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <Card 
      className="cursor-pointer group overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display font-bold text-white text-lg mb-1">
            {category.name}
          </h3>
          <p className="text-white/90 text-sm">
            {category.productCount} products
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;