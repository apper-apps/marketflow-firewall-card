import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ProductCarousel = ({ products, onAddToCart, title = "Recommended Products" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 768) setVisibleItems(2);
      else if (width < 1024) setVisibleItems(3);
      else setVisibleItems(4);
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Touch/Mouse drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    setDragStart(clientX);
    startX.current = clientX;
    if (carouselRef.current) {
      scrollLeft.current = carouselRef.current.scrollLeft;
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = clientX - dragStart;
    setDragOffset(diff);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        handlePrev();
      } else if (dragOffset < 0 && currentIndex < maxIndex) {
        handleNext();
      }
    }
    
    setDragOffset(0);
  };

  const slideTransform = `translateX(${-(currentIndex * (100 / visibleItems)) + (isDragging ? (dragOffset / window.innerWidth) * 100 : 0)}%)`;

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl lg:text-3xl text-gray-900">
          {title}
        </h2>
        
        {products.length > visibleItems && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 h-8 w-8"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 h-8 w-8"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
          style={{ transform: slideTransform }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.Id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleItems}%` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="px-1">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {products.length > visibleItems && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(products.length / visibleItems) }, (_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / visibleItems) === i
                  ? 'bg-primary w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;