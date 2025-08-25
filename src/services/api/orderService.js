import ordersData from "@/services/mockData/orders.json";

let orders = [...ordersData];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders];
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === id);
    return order ? { ...order } : null;
  },

  async create(orderData) {
    await delay(500);
const newOrder = {
      Id: Math.max(...orders.map(o => o.Id), 0) + 1,
      ...orderData,
      status: "processing",
      date: new Date().toISOString(),
      timeline: [
        {
          status: "pending",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          description: "Order received and confirmed"
        },
        {
          status: "processing",
          timestamp: new Date().toISOString(),
          description: "Order is being prepared for shipment"
        }
      ]
    };
    orders.push(newOrder);
    return { ...newOrder };
  },
async updateStatus(id, status) {
    await delay(300);
    const order = orders.find(o => o.Id === id);
    if (order) {
      order.status = status;
      
      // Add to timeline if not already present
      const existingTimelineEntry = order.timeline?.find(t => t.status === status);
      if (!existingTimelineEntry) {
        if (!order.timeline) order.timeline = [];
        
        const statusDescriptions = {
          pending: "Order received and confirmed",
          processing: "Order is being prepared for shipment",
          shipped: "Order has been shipped and is on the way",
          delivered: "Order has been delivered successfully"
        };
        
        order.timeline.push({
          status,
          timestamp: new Date().toISOString(),
          description: statusDescriptions[status] || "Status updated"
        });
        
        // Sort timeline by status order
        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        order.timeline.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      }
      
      return { ...order };
    }
return null;
  },

  async getOrderTimeline(id) {
    await delay(200);
    const order = orders.find(o => o.Id === id);
    return order?.timeline || [];
  }
};