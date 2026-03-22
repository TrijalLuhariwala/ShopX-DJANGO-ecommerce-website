import { useState, useEffect } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { apiGetSellerOrders } from "@/lib/api";

const statusColors = {
  PAID: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const SellerOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSellerOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={32} className="animate-spin text-accent" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-16">
      <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground">No orders yet. Share your products to get sales!</p>
    </div>
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Orders Received</h2>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-lg font-bold text-foreground">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order, i) =>
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card rounded-xl border border-border p-4 shadow-soft hover:shadow-elevated transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Order #{order.order_id} → {order.product_name}</p>
                <p className="text-xs text-muted-foreground">Buyer: {order.buyer} · {order.city}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">₹{order.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Qty: {order.quantity}</p>
                <Badge className={`text-xs border-0 mt-1 ${statusColors[order.status] || "bg-secondary text-foreground"}`}>{order.status}</Badge>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SellerOrderManagement;