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
  },

  async getPromotionalBanners() {
    await delay(200);
    
    // Get featured products for promotional banners
    const featuredProducts = productsData
      .filter(p => p.rating >= 4.5 && p.inStock)
      .slice(0, 4);

    const banners = [
      {
        id: 1,
        title: "Summer Electronics Sale",
        description: "Upgrade your tech with premium wireless headphones featuring noise cancellation and 30-hour battery life.",
        badge: "Limited Time",
        discount: 25,
        price: 299.99,
        originalPrice: 399.99,
        backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
        productImage: featuredProducts[0]?.images[0],
        primaryButtonText: "Shop Electronics",
        primaryLink: "/shop?category=Electronics",
        secondaryButtonText: "View Details",
        secondaryLink: `/product/${featuredProducts[0]?.Id}`
      },
      {
        id: 2,
        title: "Kitchen Essentials Collection",
        description: "Professional-grade kitchen tools and cookware for the home chef. Quality that lasts a lifetime.",
        badge: "New Arrivals",
        discount: 20,
        price: 149.99,
        originalPrice: 189.99,
        backgroundImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
        productImage: featuredProducts[1]?.images[0],
        primaryButtonText: "Shop Kitchen",
        primaryLink: "/shop?category=Kitchen",
        secondaryButtonText: "Learn More",
        secondaryLink: "/shop"
      },
      {
        id: 3,
        title: "Home Comfort Sale",
        description: "Transform your living space with luxurious organic cotton bedding and memory foam comfort.",
        badge: "Best Sellers",
        discount: 30,
        price: 89.99,
        originalPrice: 119.99,
        backgroundImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop",
        productImage: featuredProducts[2]?.images[0],
        primaryButtonText: "Shop Home",
        primaryLink: "/shop?category=Home",
        secondaryButtonText: "View Collection",
        secondaryLink: "/shop"
      },
      {
        id: 4,
        title: "Fashion Forward Deals",
        description: "Complete your look with premium leather accessories and designer sunglasses. Style meets quality.",
        badge: "Trending Now",
        discount: 15,
        price: 129.99,
        originalPrice: 159.99,
        backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
        productImage: featuredProducts[3]?.images[0],
        primaryButtonText: "Shop Fashion",
        primaryLink: "/shop?category=Fashion",
        secondaryButtonText: "See Trends",
        secondaryLink: "/shop"
      }
    ];

    return banners;
  }
};