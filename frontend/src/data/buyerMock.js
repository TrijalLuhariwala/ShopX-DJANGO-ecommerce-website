
import { products } from "@/data/mock";

export const mockOrders = [
{
  id: "ORD-2026-001",
  items: [
  { product: products[0], quantity: 1, price: 249.99 },
  { product: products[3], quantity: 2, price: 129.99 }],

  total: 509.97,
  status: "delivered",
  paymentMethod: "Credit Card",
  orderDate: "2026-02-15",
  deliveryDate: "2026-02-20",
  trackingNumber: "TRK-889921"
},
{
  id: "ORD-2026-002",
  items: [{ product: products[1], quantity: 1, price: 189.0 }],
  total: 189.0,
  status: "shipped",
  paymentMethod: "Wallet",
  orderDate: "2026-02-22",
  trackingNumber: "TRK-991034"
},
{
  id: "ORD-2026-003",
  items: [
  { product: products[5], quantity: 1, price: 159.99 },
  { product: products[7], quantity: 1, price: 69.99 }],

  total: 229.98,
  status: "processing",
  paymentMethod: "UPI",
  orderDate: "2026-02-25"
},
{
  id: "ORD-2026-004",
  items: [{ product: products[6], quantity: 1, price: 39.99 }],
  total: 39.99,
  status: "cancelled",
  paymentMethod: "Credit Card",
  orderDate: "2026-01-10"
},
{
  id: "ORD-2026-005",
  items: [{ product: products[4], quantity: 2, price: 54.0 }],
  total: 108.0,
  status: "pending",
  paymentMethod: "Wallet",
  orderDate: "2026-02-27"
}];


export const mockAddresses = [
{
  id: "a1",
  label: "Home",
  fullAddress: "42 Maple Street, Apt 3B",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  isDefault: true
},
{
  id: "a2",
  label: "Office",
  fullAddress: "Tech Park, Tower B, Floor 12",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560001",
  isDefault: false
}];


export const mockWallet = {
  balance: 1245.5,
  transactions: [
  { id: "t1", type: "credit", amount: 500, description: "Wallet top-up", date: "2026-02-25" },
  { id: "t2", type: "debit", amount: 189.0, description: "Order #ORD-2026-002", date: "2026-02-22" },
  { id: "t3", type: "credit", amount: 1000, description: "Wallet top-up", date: "2026-02-18" },
  { id: "t4", type: "debit", amount: 509.97, description: "Order #ORD-2026-001", date: "2026-02-15" },
  { id: "t5", type: "credit", amount: 200, description: "Refund - Order #ORD-2026-004", date: "2026-01-12" },
  { id: "t6", type: "debit", amount: 39.99, description: "Order #ORD-2026-004", date: "2026-01-10" }]

};

export const mockProfile = {
  username: "johndoe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  isSeller: false,
  joinedDate: "2025-06-15"
};