import { Link } from "react-router-dom";
import { products } from "@/data/mock";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-foreground mb-8">My Wishlist</h1>

        {wishlistedProducts.length === 0 ?
        <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
            <Link to="/products">
              <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                Browse Products
              </Button>
            </Link>
          </div> :

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wishlistedProducts.map((p, i) =>
          <ProductCard key={p.id} product={p} index={i} />
          )}
          </div>
        }
      </div>

      <Footer />
    </div>);

};

export default Wishlist;