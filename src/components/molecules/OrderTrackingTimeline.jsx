import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const OrderTrackingTimeline = ({ order, className }) => {
  const statusConfig = {
    pending: {
      icon: "Clock",
      label: "Order Confirmed",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30"
    },
    processing: {
      icon: "Package",
      label: "Processing",
      color: "text-info",
      bgColor: "bg-info/10", 
      borderColor: "border-info/30"
    },
    shipped: {
      icon: "Truck",
      label: "Shipped",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30"
    },
    delivered: {
      icon: "CheckCircle",
      label: "Delivered",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30"
    }
  };

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statusOrder.indexOf(order.status);
  
  // Create timeline entries for all statuses
  const timelineEntries = statusOrder.map((status, index) => {
    const timelineItem = order.timeline?.find(t => t.status === status);
    const config = statusConfig[status];
    const isCompleted = index <= currentStatusIndex;
    const isCurrent = index === currentStatusIndex;
    
    return {
      status,
      ...config,
      timestamp: timelineItem?.timestamp,
      description: timelineItem?.description,
      isCompleted,
      isCurrent,
      index
    };
  });

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
        <div className="text-sm text-gray-500">
          Order #{order.Id}
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary to-accent transition-all duration-500"
          style={{ height: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
        ></div>

        {/* Timeline Entries */}
        <div className="space-y-6">
          {timelineEntries.map((entry, index) => {
            const formatted = formatTimestamp(entry.timestamp);
            
            return (
              <motion.div
                key={entry.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                  entry.isCompleted 
                    ? `${entry.bgColor} ${entry.borderColor}` 
                    : "bg-gray-50 border-gray-200"
                )}>
                  <ApperIcon 
                    name={entry.icon}
                    size={20}
                    className={cn(
                      "transition-colors duration-300",
                      entry.isCompleted ? entry.color : "text-gray-400"
                    )}
                  />
                  
                  {/* Current Status Pulse */}
                  {entry.isCurrent && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-primary/20"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={cn(
                        "font-medium transition-colors duration-300",
                        entry.isCompleted ? "text-gray-900" : "text-gray-500"
                      )}>
                        {entry.label}
                      </h4>
                      
                      {entry.description && (
                        <p className={cn(
                          "text-sm mt-1 transition-colors duration-300",
                          entry.isCompleted ? "text-gray-600" : "text-gray-400"
                        )}>
                          {entry.description}
                        </p>
                      )}
                    </div>
                    
                    {formatted && (
                      <div className="text-right text-sm text-gray-500 ml-4">
                        <div className="font-medium">{formatted.date}</div>
                        <div className="text-xs">{formatted.time}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  {entry.isCurrent && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2",
                        entry.bgColor,
                        entry.color
                      )}
                    >
                      Current Status
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.status !== 'delivered' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" size={16} className="text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Estimated Delivery</h4>
              <p className="text-sm text-blue-700">
                {order.shippingMethod === 'express' ? '1-2 business days' : '3-5 business days'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;