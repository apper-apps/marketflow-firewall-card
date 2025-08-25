import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === id);
    return product ? { ...product } : null;
  },

  async getByCategory(category) {
    await delay(250);
    return productsData
      .filter(p => p.category.toLowerCase() === category.toLowerCase())
      .map(p => ({ ...p }));
  },

  async getFeatured(limit = 8) {
    await delay(200);
    return productsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map(p => ({ ...p }));
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return productsData
      .filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
      .map(p => ({ ...p }));
  }
};