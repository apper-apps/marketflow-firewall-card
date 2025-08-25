let cartItems = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getCartItems() {
    await delay(200);
    return [...cartItems];
  },

  async addItem(productId, quantity = 1) {
    await delay(300);
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        productId,
        quantity,
        savedForLater: false
      });
    }
    
    return [...cartItems];
  },

  async updateQuantity(productId, newQuantity) {
    await delay(200);
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = newQuantity;
    }
    return [...cartItems];
  },

  async removeItem(productId) {
    await delay(200);
    cartItems = cartItems.filter(item => item.productId !== productId);
    return [...cartItems];
  },

  async saveForLater(productId) {
    await delay(200);
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      item.savedForLater = true;
    }
    return [...cartItems];
  },

  async moveToCart(productId) {
    await delay(200);
    const item = cartItems.find(item => item.productId === productId);
    if (item) {
      item.savedForLater = false;
    }
    return [...cartItems];
  },

  async clearCart() {
    await delay(200);
    cartItems = [];
    return [];
  },

  async getCartCount() {
    await delay(100);
    return cartItems
      .filter(item => !item.savedForLater)
      .reduce((total, item) => total + item.quantity, 0);
  }
};