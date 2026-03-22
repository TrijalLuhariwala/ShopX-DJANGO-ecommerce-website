import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { apiGetProducts, apiGetCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


const categoryEmoji = (name) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("electron")) return "⚡";
  if (n.includes("fashion") || n.includes("cloth")) return "👗";
  if (n.includes("home") || n.includes("living")) return "🏠";
  if (n.includes("book")) return "📚";
  if (n.includes("sport") || n.includes("fitness")) return "🏃";
  return "📦";
};

const normaliseProduct = (p) => ({
  id: String(p.id),
  name: p.name,
  price: p.price,
  originalPrice: p.discount_percent > 0 ? +(p.price / (1 - p.discount_percent / 100)).toFixed(2) : undefined,
  description: p.description,
  stockAvailable: p.stock_available,
  category: p.category?.toLowerCase().replace(/\s+/g, "-") || "",
  seller: { id: p.seller?.id, name: p.seller?.username, rating: 4.5 },
  images: p.images?.length ? p.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"],
  rating: 4.5,
  reviewCount: 0,
});

const Index = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiGetProducts().then(({ data }) => setAllProducts(data.map(normaliseProduct))).catch(() => { });
    apiGetCategories().then(({ data }) => setCategories(data)).catch(() => { });
  }, []);

  const featuredProducts = allProducts.slice(0, 4);
  const trendingProducts = allProducts.slice(4, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">

              New Season Arrivals
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl leading-tight mb-6">

              Discover Products You'll Love
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-primary-foreground/70 text-lg mb-8 max-w-lg">

              Curated collections from independent sellers. Quality meets style in every purchase.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-4">

              <Link to="/products">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 font-semibold text-base">
                  Shop Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                  Start Selling
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $100" },
              { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected" },
              { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy" }].
              map((item) =>
                <div key={item.label} className="flex items-center gap-3 justify-center">
                  <item.icon size={22} className="text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Shop by Category</h2>
          <Link to="/products" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) =>
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>

              <Link
                to={`/products?category=${cat.name?.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col items-center p-6 bg-card rounded-xl shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 group">

                <span className="text-3xl mb-3">{categoryEmoji(cat.name)}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{cat.name}</span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((p, i) =>
            <ProductCard key={p.id} product={p} index={i} />
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="gradient-accent rounded-2xl p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-accent-foreground mb-4">Become a Seller</h2>
          <p className="text-accent-foreground/80 max-w-md mx-auto mb-6">
            Join thousands of sellers and start earning today. Easy setup, powerful tools.
          </p>
          <Link to="/auth">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl text-foreground">Trending Now</h2>
          <Link to="/products" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((p, i) =>
            <ProductCard key={p.id} product={p} index={i} />
          )}
        </div>
      </section>

      <Footer />
    </div>);

};

export default Index;