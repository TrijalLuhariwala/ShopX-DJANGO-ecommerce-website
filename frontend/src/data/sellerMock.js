import { products } from "@/data/mock";



























// Seller's own products (filter by seller s1 for demo)
export const sellerProducts = [
products[0], // Headphones
{
  id: "sp1",
  name: "Portable Bluetooth Speaker",
  price: 79.99,
  originalPrice: 99.99,
  description: "Compact waterproof speaker with 360° sound and 12-hour battery. Perfect for outdoor adventures.",
  stockAvailable: 32,
  category: "electronics",
  subcategory: "audio",
  seller: { id: "s1", name: "AudioTech Pro", rating: 4.8 },
  images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"],
  rating: 4.5,
  reviewCount: 89
},
{
  id: "sp2",
  name: "Wireless Earbuds Pro",
  price: 149.99,
  description: "True wireless earbuds with ANC, transparency mode, and premium sound quality. 8h + 24h case.",
  stockAvailable: 5,
  category: "electronics",
  subcategory: "audio",
  seller: { id: "s1", name: "AudioTech Pro", rating: 4.8 },
  images: ["https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600"],
  rating: 4.6,
  reviewCount: 201
},
{
  id: "sp3",
  name: "Studio Monitor Headphones",
  price: 199.00,
  description: "Professional-grade open-back headphones for studio mixing and mastering. Flat frequency response.",
  stockAvailable: 0,
  category: "electronics",
  subcategory: "audio",
  seller: { id: "s1", name: "AudioTech Pro", rating: 4.8 },
  images: ["https://images.unsplash.com/photo-1545127398-14699f92334b?w=600"],
  rating: 4.9,
  reviewCount: 67
}];


export const sellerOrders = [
{
  id: "SO-2026-001",
  customerName: "Alice Johnson",
  customerEmail: "alice@example.com",
  customerAddress: "123 Oak Ave, New York, NY 10001",
  items: [{ product: sellerProducts[0], quantity: 1, price: 249.99 }],
  total: 249.99,
  status: "pending",
  paymentMethod: "Credit Card",
  orderDate: "2026-02-27"
},
{
  id: "SO-2026-002",
  customerName: "Bob Smith",
  customerEmail: "bob@example.com",
  customerAddress: "456 Pine St, Los Angeles, CA 90001",
  items: [
  { product: sellerProducts[1], quantity: 2, price: 79.99 },
  { product: sellerProducts[2], quantity: 1, price: 149.99 }],

  total: 309.97,
  status: "confirmed",
  paymentMethod: "Wallet",
  orderDate: "2026-02-25"
},
{
  id: "SO-2026-003",
  customerName: "Carol Davis",
  customerEmail: "carol@example.com",
  customerAddress: "789 Elm Rd, Chicago, IL 60601",
  items: [{ product: sellerProducts[0], quantity: 1, price: 249.99 }],
  total: 249.99,
  status: "shipped",
  paymentMethod: "UPI",
  orderDate: "2026-02-22",
  trackingNumber: "TRK-556677"
},
{
  id: "SO-2026-004",
  customerName: "Dan Wilson",
  customerEmail: "dan@example.com",
  customerAddress: "101 Maple Dr, Houston, TX 77001",
  items: [{ product: sellerProducts[2], quantity: 1, price: 149.99 }],
  total: 149.99,
  status: "delivered",
  paymentMethod: "Credit Card",
  orderDate: "2026-02-18",
  trackingNumber: "TRK-334455"
},
{
  id: "SO-2026-005",
  customerName: "Eve Martinez",
  customerEmail: "eve@example.com",
  customerAddress: "202 Cedar Blvd, Phoenix, AZ 85001",
  items: [{ product: sellerProducts[1], quantity: 1, price: 79.99 }],
  total: 79.99,
  status: "cancelled",
  paymentMethod: "Wallet",
  orderDate: "2026-02-15"
}];


export const recentActivity = [
{ id: "a1", type: "order", message: "New order #SO-2026-001 received from Alice Johnson", date: "2026-02-27T10:30:00" },
{ id: "a2", type: "review", message: "5-star review on Wireless Noise-Cancelling Headphones", date: "2026-02-26T15:20:00" },
{ id: "a3", type: "order", message: "Order #SO-2026-002 confirmed by Bob Smith", date: "2026-02-25T09:10:00" },
{ id: "a4", type: "product", message: "Stock low alert: Wireless Earbuds Pro (5 remaining)", date: "2026-02-24T18:00:00" },
{ id: "a5", type: "payout", message: "Payout of $399.98 processed to your bank account", date: "2026-02-23T12:00:00" },
{ id: "a6", type: "order", message: "Order #SO-2026-003 shipped to Carol Davis", date: "2026-02-22T14:45:00" }];