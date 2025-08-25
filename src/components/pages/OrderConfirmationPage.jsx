import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { orderService } from "@/services/api/orderService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;
  const orderTotal = location.state?.orderTotal;

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDays = order?.shippingMethod === "overnight" ? 1 : 
                         order?.shippingMethod === "express" ? 3 : 7;
    const deliveryDate = new Date(today.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
    return formatDate(deliveryDate);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <ApperIcon name="CheckCircle" size={40} className="text-white" />
          </motion.div>

          <h1 className="font-display font-bold text-4xl lg:text-5xl text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Thank you for your purchase! Your order has been received and is being processed. 
            You'll receive a confirmation email shortly.
          </p>

          {order && (
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-6 py-3">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">Order Number</p>
                <p className="text-lg font-bold text-primary">#{order.Id.toString().padStart(6, "0")}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">Total</p>
                <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formatPrice(orderTotal || order.total)}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Package" size={24} className="text-primary mr-3" />
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium text-gray-900">{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-warning/20 to-yellow-200 text-warning">
                    Processing
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium text-gray-900">{getEstimatedDelivery()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <ApperIcon name="CreditCard" size={16} className="mr-1" />
                    •••• {order.paymentMethod?.last4 || "1234"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-6 flex items-center">
                <ApperIcon name="Truck" size={24} className="text-secondary mr-3" />
                Shipping Address
              </h2>
              
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <p className="text-sm">
                    <strong>Email:</strong> {order.shippingAddress?.email}
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        {order && order.items && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-12"
          >
            <h2 className="font-display font-semibold text-xl text-gray-900 mb-6 flex items-center">
              <ApperIcon name="ShoppingBag" size={24} className="text-accent mr-3" />
              Order Items ({order.items.length})
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Item #{item.productId}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-12"
        >
          <h2 className="font-display font-semibold text-2xl text-gray-900 mb-6 text-center">
            What happens next?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Mail" size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Confirmation</h3>
              <p className="text-gray-600 text-sm">
                You'll receive an order confirmation email with your receipt and tracking information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Package" size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-gray-600 text-sm">
                We'll prepare your items for shipment and send you tracking details once shipped.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Home" size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600 text-sm">
                Your order will be delivered to your specified address within the estimated timeframe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/shop">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <ApperIcon name="ShoppingBag" size={20} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <ApperIcon name="Mail" size={20} className="mr-2" />
            Email Receipt
          </Button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-600 mb-4">
            Questions about your order? We're here to help!
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <a href="#" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              <ApperIcon name="Mail" size={16} className="mr-1" />
              Email Support
            </a>
            <a href="#" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              <ApperIcon name="Phone" size={16} className="mr-1" />
              Call Us
            </a>
            <a href="#" className="text-primary hover:text-primary/80 transition-colors flex items-center">
              <ApperIcon name="MessageCircle" size={16} className="mr-1" />
              Live Chat
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;