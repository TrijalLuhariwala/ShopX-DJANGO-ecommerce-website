import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";






const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ?
  Math.round((product.originalPrice - product.price) / product.originalPrice * 100) :
  null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300">
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" />
          
        </Link>

        {discount &&
        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        }

        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-soft hover:scale-110 transition-transform">
          
          <Heart
            size={16}
            className={wishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"} />
          
        </button>

        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
          
          <ShoppingCart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.seller.name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-accent transition-colors font-body">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <Star size={12} className="fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice &&
          <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          }
        </div>
      </div>
    </motion.div>);

};

export default ProductCard;