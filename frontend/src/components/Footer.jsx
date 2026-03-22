import { Link } from "react-router-dom";
import { categories } from "@/data/mock";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ShopX Logo" className="h-8 w-8 object-contain brightness-0 invert" />
              <h3 className="font-display text-2xl font-bold">ShopX</h3>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              ShopX is your destination for curated products from trusted sellers worldwide.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) =>
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {cat.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Sell on ShopX", "Press"].map((item) =>
                <li key={item}>
                  <span className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {["Help Center", "Shipping", "Returns", "Contact Us"].map((item) =>
                <li key={item}>
                  <span className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">© 2026 ShopX. All rights reserved.</p>
        </div>
      </div>
    </footer>);

};

export default Footer;