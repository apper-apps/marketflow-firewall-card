import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import ProductCarousel from "@/components/molecules/ProductCarousel";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    setError("");
    try {
      const productData = await productService.getById(parseInt(id));
      if (!productData) {
        setError("Product not found");
        return;
      }

setProduct(productData);

// Load recommended products using collaborative filtering
      const boughtTogether = await productService.getRecommendations(id, 'bought', 8);
      setRelatedProducts(boughtTogether);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(product.Id.toString(), quantity);
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      await cartService.addItem(product.Id.toString(), quantity);
      navigate("/checkout");
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const handleRelatedProductAddToCart = async (relatedProduct) => {
    try {
      await cartService.addItem(relatedProduct.Id.toString(), 1);
      toast.success(`${relatedProduct.title} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" size={16} className="text-accent fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="StarHalf" size={16} className="text-accent fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProductData} />;
  if (!product) return <Error message="Product not found" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button onClick={() => navigate("/shop")} className="hover:text-primary">
            Shop
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button 
            onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/\s+/g, "-")}`)} 
            className="hover:text-primary capitalize"
          >
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-900 truncate">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-primary shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {product.category}
                </Badge>
                {!product.inStock && (
                  <Badge variant="error">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="font-medium text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="success">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.specifications && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700 capitalize">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <ApperIcon name="Minus" size={16} />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= 10 || !product.inStock}
                  >
                    <ApperIcon name="Plus" size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ApperIcon name="Zap" size={20} className="mr-2" />
                  Buy Now
                </Button>
              </div>

              {!product.inStock && (
                <p className="text-error text-sm">
                  This item is currently out of stock. Please check back later.
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Truck" size={16} className="text-secondary" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="RefreshCw" size={16} className="text-success" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Shield" size={16} className="text-accent" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Headphones" size={16} className="text-primary" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>

{/* Recommended Products Carousel */}
        {relatedProducts.length > 0 && (
          <ProductCarousel
            products={relatedProducts}
            onAddToCart={handleRelatedProductAddToCart}
            title="Customers who bought this item also bought"
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;