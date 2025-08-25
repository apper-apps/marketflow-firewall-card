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
      date: new Date().toISOString()
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async updateStatus(id, status) {
    await delay(300);
    const order = orders.find(o => o.Id === id);
    if (order) {
      order.status = status;
      return { ...order };
    }
    return null;
  }
};