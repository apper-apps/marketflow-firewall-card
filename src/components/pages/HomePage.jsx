import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const products = await productService.getAll();
      
      // Featured products (highest rated)
      const featured = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      
      // Categories (unique categories with sample data)
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      const categoryData = uniqueCategories.map(cat => ({
        id: cat.toLowerCase().replace(/\s+/g, "-"),
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-"),
        image: products.find(p => p.category === cat)?.images[0] || "/api/placeholder/300/200",
        productCount: products.filter(p => p.category === cat).length
      })).slice(0, 6);
      
      // Deals (products with discounts)
      const dealsData = products
        .filter(p => p.originalPrice && p.originalPrice > p.price)
        .slice(0, 6);

      setFeaturedProducts(featured);
      setCategories(categoryData);
      setDeals(dealsData);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await cartService.addItem(product.Id.toString(), 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-accent to-secondary text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Products Today
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Shop from thousands of premium products at unbeatable prices. 
              Fast shipping, easy returns, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="xl"
                onClick={() => window.location.href = "/shop"}
                className="bg-white text-primary hover:bg-gray-50 shadow-xl transform hover:scale-105"
              >
                <ApperIcon name="ShoppingBag" size={24} className="mr-3" />
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => window.location.href = "/deals"}
                className="border-white text-white hover:bg-white hover:text-primary shadow-xl transform hover:scale-105"
              >
                <ApperIcon name="Percent" size={24} className="mr-3" />
                View Deals
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you need
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked favorites from our collection
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" size="lg">
                View All
                <ApperIcon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.Id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Deals Section */}
        {deals.length > 0 && (
          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-error to-red-600 text-white px-4 py-2 rounded-full mb-4">
                <ApperIcon name="Zap" size={20} />
                <span className="font-medium">Limited Time Offers</span>
              </div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
                Hot Deals & Discounts
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Don't miss out on these incredible savings opportunities
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {deals.map((product) => (
                <motion.div key={product.Id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Trust Section */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-white rounded-2xl my-16">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
              Why Choose MarketFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "Shield",
                title: "Secure Shopping",
                description: "Your data and payments are protected with bank-level security"
              },
              {
                icon: "Truck",
                title: "Fast Delivery",
                description: "Free shipping on orders over $50 with quick delivery options"
              },
              {
                icon: "RefreshCw",
                title: "Easy Returns",
                description: "30-day hassle-free returns on all purchases"
              },
              {
                icon: "Headphones",
                title: "24/7 Support",
                description: "Our customer service team is here to help anytime"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ApperIcon name={feature.icon} size={32} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;