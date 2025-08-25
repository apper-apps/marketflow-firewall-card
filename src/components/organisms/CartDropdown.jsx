import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartDropdown = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen]);

  const loadCartData = async () => {
    setLoading(true);
    try {
      const items = await cartService.getCartItems();
      const allProducts = await productService.getAll();
      setCartItems(items);
      setProducts(allProducts);
    } catch (error) {
      console.error("Error loading cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (productId) => {
    return products.find(p => p.Id.toString() === productId.toString());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const displayItems = cartItems.slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-40 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg text-gray-900">
                  Shopping Cart
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ApperIcon name="ShoppingCart" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onClose();
                      window.location.href = "/shop";
                    }}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="py-2">
                  {displayItems.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {product.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-semibold text-sm text-primary">
                              {formatPrice(product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {cartItems.length > 3 && (
                    <div className="px-4 py-2 text-center text-sm text-gray-500">
                      +{cartItems.length - 3} more items
                    </div>
                  )}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link to="/cart" className="flex-1" onClick={onClose}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link to="/checkout" className="flex-1" onClick={onClose}>
                    <Button variant="primary" size="sm" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDropdown;