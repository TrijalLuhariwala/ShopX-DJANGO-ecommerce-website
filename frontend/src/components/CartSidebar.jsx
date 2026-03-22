import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/30 z-50" onClick={() => setIsCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-elevated animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl">Cart ({totalItems})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ?
          <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div> :

          <div className="space-y-6">
              {items.map((item) =>
            <div key={item.product.id} className="flex gap-4">
                  <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg" />
              
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                    <p className="text-sm font-semibold text-foreground mt-1">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                    
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                    
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive">
                    <X size={16} />
                  </button>
                </div>
            )}
            </div>
          }
        </div>

        {/* Footer */}
        {items.length > 0 &&
        <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold"
            onClick={() => {setIsCartOpen(false);navigate("/checkout");}}>
            
              Checkout
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        }
      </div>
    </>);

};

export default CartSidebar;