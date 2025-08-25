import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PromotionalBannerCarousel = ({ banners = [], autoRotate = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef(null);

  // Auto rotation logic
  useEffect(() => {
    if (autoRotate && banners.length > 1 && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length);
      }, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [autoRotate, banners.length, isHovered, interval]);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? banners.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banners[currentIndex].backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-white space-y-6"
                >
                  {banners[currentIndex].badge && (
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full">
                      <ApperIcon name="Zap" size={18} />
                      <span className="font-medium text-sm">
                        {banners[currentIndex].badge}
                      </span>
                    </div>
                  )}
                  
                  <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
                    {banners[currentIndex].title}
                  </h2>
                  
                  <p className="text-lg md:text-xl text-gray-200 max-w-lg">
                    {banners[currentIndex].description}
                  </p>
                  
                  {banners[currentIndex].discount && (
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl md:text-3xl font-bold text-accent">
                        {banners[currentIndex].discount}% OFF
                      </span>
                      {banners[currentIndex].originalPrice && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300 line-through">
                            {formatPrice(banners[currentIndex].originalPrice)}
                          </span>
                          <span className="text-xl font-bold text-white">
                            {formatPrice(banners[currentIndex].price)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={banners[currentIndex].primaryLink || '/shop'}>
                      <Button size="lg" className="w-full sm:w-auto">
                        {banners[currentIndex].primaryButtonText || 'Shop Now'}
                        <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                      </Button>
                    </Link>
                    
                    {banners[currentIndex].secondaryLink && (
                      <Link to={banners[currentIndex].secondaryLink}>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900">
                          {banners[currentIndex].secondaryButtonText || 'Learn More'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>

                {/* Product Image */}
                {banners[currentIndex].productImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex justify-center lg:justify-end"
                  >
                    <div className="relative">
                      <img
                        src={banners[currentIndex].productImage}
                        alt={banners[currentIndex].title}
                        className="max-w-xs md:max-w-sm lg:max-w-md object-cover rounded-xl shadow-2xl"
                      />
                      {banners[currentIndex].discount && (
                        <div className="absolute -top-4 -right-4 bg-error text-white px-3 py-2 rounded-full font-bold shadow-lg">
                          -{banners[currentIndex].discount}%
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ApperIcon name="ChevronLeft" size={24} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ApperIcon name="ChevronRight" size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoRotate && banners.length > 1 && !isHovered && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default PromotionalBannerCarousel;