import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import OrderTrackingTimeline from "@/components/molecules/OrderTrackingTimeline";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll()
      ]);
      
      setOrders(ordersData);
      
      // Create products lookup
      const productsLookup = {};
      productsData.forEach(product => {
        productsLookup[product.Id.toString()] = product;
      });
      setProducts(productsLookup);
    } catch (error) {
      console.error("Error loading order history:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.Id.toString().includes(searchTerm) ||
                         order.shippingAddress?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", label: "Pending" },
      processing: { variant: "info", label: "Processing" },
      shipped: { variant: "primary", label: "Shipped" },
      delivered: { variant: "success", label: "Delivered" }
    };
    
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewTimeline = (order) => {
    setSelectedOrder(order);
    setShowTimeline(true);
  };

  const handleReorder = async (order) => {
    try {
      // Add all items from the order back to cart
      for (const item of order.items) {
        await cartService.addItem(item.productId, item.quantity);
      }
      toast.success("Items added to cart!");
      navigate("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder items");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Empty 
            title="No orders found"
            description="You haven't placed any orders yet or no orders match your search."
            action={
              <Link to="/shop">
                <Button variant="primary">
                  Start Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.Id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item, index) => {
                        const product = products[item.productId];
                        if (!product) return null;
                        
                        return (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <img
                              src={product.images?.[0]}
                              alt={product.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {product.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              x{item.quantity}
                            </span>
                          </div>
                        );
                      })}
                      
                      {order.items?.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2 text-xs text-gray-600">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTimeline(order)}
                      className="flex items-center"
                    >
                      <ApperIcon name="MapPin" size={16} className="mr-2" />
                      Track Order
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="flex items-center"
                    >
                      <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                      Reorder
                    </Button>

                    <Link 
                      to={`/order-confirmation?orderId=${order.Id}`}
                      className="inline-flex"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                      >
                        <ApperIcon name="FileText" size={16} className="mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Modal */}
      {showTimeline && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-modal">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Tracking
                </h2>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <OrderTrackingTimeline order={selectedOrder} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;