let wishlistItems = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const wishlistService = {
  async getAll() {
    await delay(100);
    return [...wishlistItems];
  },

  async addToWishlist(productId) {
    await delay(200);
    
    if (typeof productId !== 'number') {
      throw new Error('Product ID must be a number');
    }
    
    const exists = wishlistItems.find(item => item.productId === productId);
    if (!exists) {
      wishlistItems.push({
        Id: wishlistItems.length + 1,
        productId,
        addedAt: new Date().toISOString()
      });
    }
    
    return [...wishlistItems];
  },

  async removeFromWishlist(productId) {
    await delay(200);
    
    if (typeof productId !== 'number') {
      throw new Error('Product ID must be a number');
    }
    
    wishlistItems = wishlistItems.filter(item => item.productId !== productId);
    return [...wishlistItems];
  },

  async isInWishlist(productId) {
    await delay(50);
    
    if (typeof productId !== 'number') {
      return false;
    }
    
    return wishlistItems.some(item => item.productId === productId);
  },

  async getWishlistCount() {
    await delay(50);
    return wishlistItems.length;
  },

  async toggleWishlist(productId) {
    await delay(200);
    
    if (typeof productId !== 'number') {
      throw new Error('Product ID must be a number');
    }
    
    const isInList = await this.isInWishlist(productId);
    
    if (isInList) {
      await this.removeFromWishlist(productId);
      return false;
    } else {
      await this.addToWishlist(productId);
      return true;
    }
  },

  async clearWishlist() {
    await delay(200);
    wishlistItems = [];
    return [];
  }
};