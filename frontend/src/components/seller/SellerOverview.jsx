import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiGetSellerDashboard } from "@/lib/api";

const SellerOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetSellerDashboard()
      .then(({ data: d }) => setData(d))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={32} className="animate-spin text-accent" />
    </div>
  );

  const stats_raw = data?.stats || {};
  const products = data?.products || [];
  const lowStock = products.filter((p) => p.stock_available <= 10);

  const stats = [
    { label: "Total Revenue", value: `₹${(stats_raw.revenue || 0).toFixed(2)}`, icon: DollarSign, color: "bg-success/10 text-success" },
    { label: "Total Orders", value: stats_raw.total_orders || 0, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
    { label: "Products Listed", value: stats_raw.total_products || 0, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Low Stock Items", value: lowStock.length, icon: Clock, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) =>
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl border border-border p-5 shadow-soft">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product list summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-6 shadow-soft">
          <h3 className="font-body font-semibold text-foreground mb-4">My Products ({products.length})</h3>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-md object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">₹{p.price} · {p.stock_available} in stock</p>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No products yet. Add your first one!</p>}
          </div>
        </motion.div>

        {/* Low stock alerts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-xl border border-border p-6 shadow-soft">
          <h3 className="font-body font-semibold text-foreground mb-4">Stock Alerts</h3>
          <div className="space-y-3">
            {lowStock.slice(0, 5).map((p) =>
              <div key={p.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-md object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className={`text-xs font-medium ${p.stock_available === 0 ? "text-destructive" : "text-warning"}`}>
                    {p.stock_available === 0 ? "Out of stock" : `${p.stock_available} left`}
                  </p>
                </div>
              </div>
            )}
            {lowStock.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">All products well stocked! 🎉</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerOverview;