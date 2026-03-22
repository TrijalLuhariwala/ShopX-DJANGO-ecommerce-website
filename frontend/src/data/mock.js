





























export const categories = [
{
  id: "1", name: "Electronics", slug: "electronics",
  subcategories: [
  { id: "1a", name: "Smartphones", slug: "smartphones" },
  { id: "1b", name: "Laptops", slug: "laptops" },
  { id: "1c", name: "Audio", slug: "audio" }]

},
{
  id: "2", name: "Fashion", slug: "fashion",
  subcategories: [
  { id: "2a", name: "Men", slug: "men" },
  { id: "2b", name: "Women", slug: "women" },
  { id: "2c", name: "Accessories", slug: "accessories" }]

},
{
  id: "3", name: "Home & Living", slug: "home-living",
  subcategories: [
  { id: "3a", name: "Furniture", slug: "furniture" },
  { id: "3b", name: "Decor", slug: "decor" },
  { id: "3c", name: "Kitchen", slug: "kitchen" }]

},
{
  id: "4", name: "Books", slug: "books",
  subcategories: [
  { id: "4a", name: "Fiction", slug: "fiction" },
  { id: "4b", name: "Non-Fiction", slug: "non-fiction" }]

},
{
  id: "5", name: "Sports", slug: "sports",
  subcategories: [
  { id: "5a", name: "Fitness", slug: "fitness" },
  { id: "5b", name: "Outdoor", slug: "outdoor" }]

}];


export const products = [
{
  id: "1", name: "Wireless Noise-Cancelling Headphones", price: 249.99, originalPrice: 349.99,
  description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Features adaptive sound control and comfortable memory foam ear cushions.",
  stockAvailable: 45, category: "electronics", subcategory: "audio",
  seller: { id: "s1", name: "AudioTech Pro", rating: 4.8 },
  images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"],
  rating: 4.7, reviewCount: 328, isFeatured: true, isTrending: true
},
{
  id: "2", name: "Minimalist Leather Watch", price: 189.00,
  description: "Elegant timepiece with genuine Italian leather strap and sapphire crystal glass. Swiss movement, water-resistant to 50m.",
  stockAvailable: 23, category: "fashion", subcategory: "accessories",
  seller: { id: "s2", name: "TimeCraft", rating: 4.9 },
  images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"],
  rating: 4.9, reviewCount: 156, isFeatured: true
},
{
  id: "3", name: "Organic Cotton Throw Blanket", price: 79.99, originalPrice: 99.99,
  description: "Luxuriously soft organic cotton throw in a timeless herringbone weave. Perfect for adding warmth and texture to any room.",
  stockAvailable: 67, category: "home-living", subcategory: "decor",
  seller: { id: "s3", name: "CozyHome", rating: 4.6 },
  images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
  rating: 4.5, reviewCount: 89, isFeatured: true
},
{
  id: "4", name: "Smart Fitness Tracker", price: 129.99, originalPrice: 179.99,
  description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant and stylish.",
  stockAvailable: 112, category: "electronics", subcategory: "smartphones",
  seller: { id: "s4", name: "FitGear", rating: 4.5 },
  images: ["https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=600"],
  rating: 4.4, reviewCount: 445, isTrending: true
},
{
  id: "5", name: "Handcrafted Ceramic Vase", price: 54.00,
  description: "Artisan-made ceramic vase with a unique glaze finish. Each piece is one-of-a-kind, perfect for fresh or dried arrangements.",
  stockAvailable: 18, category: "home-living", subcategory: "decor",
  seller: { id: "s5", name: "ArtisanClay", rating: 4.7 },
  images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600"],
  rating: 4.8, reviewCount: 67, isFeatured: true
},
{
  id: "6", name: "Running Shoes Pro", price: 159.99,
  description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for both road and trail running.",
  stockAvailable: 89, category: "sports", subcategory: "fitness",
  seller: { id: "s6", name: "RunElite", rating: 4.6 },
  images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
  rating: 4.6, reviewCount: 234, isTrending: true
},
{
  id: "7", name: "Bestselling Novel Collection", price: 39.99, originalPrice: 59.99,
  description: "Curated collection of 3 award-winning novels. Beautifully bound hardcovers perfect for avid readers and collectors.",
  stockAvailable: 34, category: "books", subcategory: "fiction",
  seller: { id: "s7", name: "PageTurner Books", rating: 4.8 },
  images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"],
  rating: 4.7, reviewCount: 178
},
{
  id: "8", name: "Premium Yoga Mat", price: 69.99,
  description: "Eco-friendly natural rubber yoga mat with alignment guides. Non-slip surface, 6mm thick for optimal comfort.",
  stockAvailable: 56, category: "sports", subcategory: "fitness",
  seller: { id: "s6", name: "RunElite", rating: 4.6 },
  images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"],
  rating: 4.5, reviewCount: 123, isTrending: true
}];