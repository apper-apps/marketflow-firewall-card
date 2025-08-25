import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { cartService } from "@/services/api/cartService";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import HomePage from "@/components/pages/HomePage";
import ShopPage from "@/components/pages/ShopPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import CartPage from "@/components/pages/CartPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import OrderConfirmationPage from "@/components/pages/OrderConfirmationPage";
import OrderHistoryPage from "@/components/pages/OrderHistoryPage";
function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  // Update cart count when cart changes
  useEffect(() => {
    const interval = setInterval(loadCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        <Header cartCount={cartCount} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/search" element={<ShopPage />} />
            <Route path="/category/:category" element={<ShopPage />} />
            <Route path="/deals" element={<ShopPage />} />
            <Route path="/categories" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
<Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<ShopPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Routes>
        </main>

        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;