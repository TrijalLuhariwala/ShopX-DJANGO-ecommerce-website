import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { apiGetCategories } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navCategories, setNavCategories] = useState([]);
  const { totalItems, setIsCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    apiGetCategories().then(({ data }) => setNavCategories(data)).catch(() => { });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>Free shipping on orders over ₹500</span>
          <span className="hidden sm:block">Need help? Call 1-800-SHOPX</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl tracking-tight text-foreground font-bold italic">
              Shop<span className="text-primary italic">X</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navCategories.map((cat) =>
              <Link
                key={cat.id}
                to={`/products?category=${cat.name?.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                {cat.name}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Heart size={20} />
              {wishlistItems?.length > 0 &&
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                  {wishlistItems.length}
                </Badge>
              }
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <ShoppingCart size={20} />
              {totalItems > 0 &&
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                  {totalItems}
                </Badge>
              }
            </button>

            {/* User */}
            <Link
              to={isAuthenticated ? (user?.isSeller ? "/seller" : "/account") : "/auth"}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen &&
          <div className="pb-4 animate-fade-in">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0 h-11"
                autoFocus />
            </div>
          </div>
        }
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen &&
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navCategories.map((cat) =>
              <Link
                key={cat.id}
                to={`/products?category=${cat.name?.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-sm font-medium text-foreground py-2 hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}>
                {cat.name}
              </Link>
            )}
            <div className="border-t border-border pt-2 mt-2">
              <Link to={isAuthenticated ? "/account" : "/auth"} className="block text-sm font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>
                {isAuthenticated ? `Hi, ${user?.username}` : "Sign In"}
              </Link>
              {isAuthenticated && user?.isSeller &&
                <Link to="/seller" className="block text-sm font-medium text-accent py-2" onClick={() => setMobileMenuOpen(false)}>
                  Seller Dashboard
                </Link>
              }
            </div>
          </div>
        </div>
      }
    </header>
  );
};

export default Header;
