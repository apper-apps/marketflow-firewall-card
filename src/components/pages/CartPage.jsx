import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    setLoading(true);
    setError("");
    try {
      const [items, allProducts] = await Promise.all([
        cartService.getCartItems(),
        productService.getAll()
      ]);
      
      const activeItems = items.filter(item => !item.savedForLater);
      const saved = items.filter(item => item.savedForLater);
      
      setCartItems(activeItems);
      setSavedItems(saved);
      setProducts(allProducts);
    } catch (err) {
      setError("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (productId) => {
    return products.find(p => p.Id.toString() === productId.toString());
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await cartService.updateQuantity(productId, newQuantity);
      setCartItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      setSavedItems(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleSaveForLater = async (productId) => {
    try {
      await cartService.saveForLater(productId);
      const item = cartItems.find(item => item.productId === productId);
      if (item) {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
        setSavedItems(prev => [...prev, { ...item, savedForLater: true }]);
      }
    } catch (error) {
      toast.error("Failed to save item for later");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await cartService.moveToCart(productId);
      const item = savedItems.find(item => item.productId === productId);
      if (item) {
        setSavedItems(prev => prev.filter(item => item.productId !== productId));
        setCartItems(prev => [...prev, { ...item, savedForLater: false }]);
      }
      toast.success("Item moved to cart");
    } catch (error) {
      toast.error("Failed to move item to cart");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await cartService.clearCart();
        setCartItems([]);
        toast.success("Cart cleared");
      } catch (error) {
        toast.error("Failed to clear cart");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 9.99;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCartData} />;

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <Empty
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet. Start shopping to fill it up!"
        actionLabel="Continue Shopping"
        icon="ShoppingCart"
        onAction={() => navigate("/shop")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-900">
            Shopping Cart
          </h1>
          <Link to="/shop">
            <Button variant="outline" size="md">
              <ApperIcon name="ArrowLeft" size={18} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-display font-semibold text-xl text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  {cartItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-error hover:text-error/80"
                    >
                      <ApperIcon name="Trash2" size={16} className="mr-2" />
                      Clear Cart
                    </Button>
                  )}
                </div>
                <div>
                  {cartItems.map((item) => {
                    const product = getProductById(item.productId);
                    return (
                      <CartItem
                        key={item.productId}
                        item={item}
                        product={product}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-display font-semibold text-xl text-gray-900">
                    Saved for Later ({savedItems.length})
                  </h2>
                </div>
                <div>
                  {savedItems.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    
                    return (
                      <div key={item.productId} className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {product.title}
                          </h3>
                          <div className="text-lg font-bold text-primary mb-2">
                            {formatPrice(product.price)}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveToCart(item.productId)}
                            >
                              Move to Cart
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-error hover:text-error/80"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {cartItems.length === 0 && savedItems.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Your cart is empty, but you have items saved for later.
                </p>
                <Link to="/shop">
                  <Button variant="primary" size="lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-success font-medium">Free</span>
                      ) : (
                        formatPrice(calculateShipping())
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                {calculateShipping() > 0 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-accent">
                      <ApperIcon name="Truck" size={16} className="inline mr-1" />
                      Add {formatPrice(50 - calculateSubtotal())} more for free shipping
                    </p>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                  className="w-full mb-4"
                >
                  <ApperIcon name="CreditCard" size={20} className="mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <ApperIcon name="Shield" size={14} className="inline mr-1" />
                  Secure checkout guaranteed
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;