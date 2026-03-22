import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { products } from "@/data/mock";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground">Product Not Found</h1>
          <Link to="/products" className="text-accent hover:underline mt-4 inline-block">Back to Products</Link>
        </div>
        <Footer />
      </div>);

  }

  const wishlisted = isWishlisted(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ?
  Math.round((product.originalPrice - product.price) / product.originalPrice * 100) :
  null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover" />
              
            </div>
            {product.images.length > 1 &&
            <div className="flex gap-3">
                {product.images.map((img, i) =>
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selectedImage ? "border-accent" : "border-border"}`
                }>
                
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
              )}
              </div>
            }
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{product.seller.name}</p>
                <h1 className="font-display text-3xl text-foreground">{product.name}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) =>
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"} />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                {product.originalPrice &&
                <>
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                    <Badge className="bg-accent/10 text-accent border-0 font-semibold">-{discount}%</Badge>
                  </>
                }
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-2">
                {product.stockAvailable > 0 ?
                <Badge className="bg-success/10 text-success border-0">In Stock ({product.stockAvailable})</Badge> :

                <Badge variant="destructive">Out of Stock</Badge>
                }
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-medium text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-foreground">
                    <Plus size={16} />
                  </button>
                </div>

                <Button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold"
                  disabled={product.stockAvailable === 0}>
                  
                  <ShoppingCart size={18} className="mr-2" /> Add to Cart
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => toggleWishlist(product.id)}>
                  
                  <Heart size={18} className={wishlisted ? "fill-destructive text-destructive" : ""} />
                </Button>
              </div>

              {/* Trust */}
              <div className="border-t border-border pt-6 space-y-3">
                {[
                { icon: Truck, text: "Free shipping on orders over $100" },
                { icon: RotateCcw, text: "30-day easy returns" },
                { icon: ShieldCheck, text: "Secure checkout" }].
                map((item) =>
                <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon size={16} className="text-accent" />
                    {item.text}
                  </div>
                )}
              </div>

              {/* Seller Card */}
              <div className="bg-secondary rounded-xl p-5">
                <p className="text-xs text-muted-foreground mb-1">Sold by</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{product.seller.name}</p>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-accent text-accent" />
                    <span className="text-sm font-medium">{product.seller.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 &&
        <section className="mt-20">
            <h2 className="font-display text-2xl text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) =>
            <ProductCard key={p.id} product={p} index={i} />
            )}
            </div>
          </section>
        }
      </div>

      <Footer />
    </div>);

};

export default ProductDetail;