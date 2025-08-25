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
  },

  async getRecommendations(productId, type = 'bought', limit = 8) {
    await delay(250);
    const currentProduct = productsData.find(p => p.Id === productId);
    if (!currentProduct) return [];

    // Simulate collaborative filtering based on category, rating, and price similarity
    const recommendations = productsData
      .filter(p => p.Id !== productId)
      .map(product => {
        let score = 0;
        
        // Category similarity (highest weight)
        if (product.category === currentProduct.category) {
          score += 40;
        }
        
        // Rating similarity
        const ratingDiff = Math.abs(product.rating - currentProduct.rating);
        score += Math.max(0, 20 - (ratingDiff * 10));
        
        // Price similarity
        const priceDiff = Math.abs(product.price - currentProduct.price);
        const priceRatio = priceDiff / currentProduct.price;
        score += Math.max(0, 20 - (priceRatio * 30));
        
        // Random factor to simulate user behavior patterns
        score += Math.random() * 20;
        
        // Boost for high-rated products
        if (product.rating >= 4.5) score += 10;
        
        // Boost for in-stock products
        if (product.inStock) score += 5;

        return { ...product, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit)
      .map(({ recommendationScore, ...product }) => product);

    return recommendations;
  }
};