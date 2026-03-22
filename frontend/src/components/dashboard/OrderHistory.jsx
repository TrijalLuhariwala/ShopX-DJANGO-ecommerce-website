import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const statusColors = {
  PAID: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const OrderHistory = ({ orders = [] }) => {
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) return (
    <div className="text-center py-16">
      <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground">No orders yet. Start shopping!</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Order History</h2>
      <div className="space-y-3">
        {orders.map((order, i) =>
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Package size={20} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">₹{order.total.toFixed(2)}</p>
                <Badge className={`text-xs border-0 mt-1 ${statusColors[order.status] || "bg-secondary text-foreground"}`}>{order.status}</Badge>
              </div>
              {expanded === order.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </button>

            {expanded === order.id && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                {order.items?.map((item, idx) =>
                  <div key={idx} className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;