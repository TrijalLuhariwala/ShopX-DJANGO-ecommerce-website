import { useState, useEffect } from "react";
import { Package, MapPin, Wallet, UserCircle, ChevronRight, ShoppingBag, TrendingUp, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import OrderHistory from "@/components/dashboard/OrderHistory";
import AddressManagement from "@/components/dashboard/AddressManagement";
import WalletSection from "@/components/dashboard/WalletSection";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { apiGetProfile } from "@/lib/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "profile", label: "Profile", icon: UserCircle },
];

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate("/auth"); return; }
    apiGetProfile()
      .then(({ data }) => setProfileData(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const refreshProfile = () => {
    apiGetProfile().then(({ data }) => setProfileData(data)).catch(() => { });
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-accent" />
    </div>
  );

  const wallet = profileData?.wallet || { balance: 0 };
  const orders = profileData?.orders || [];
  const addresses = profileData?.addresses || [];
  const user = profileData?.user || {};

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
    { label: "Wallet Balance", value: `₹${wallet.balance.toFixed(2)}`, icon: Wallet, color: "bg-success/10 text-success" },
    { label: "Delivered", value: orders.filter((o) => o.status === "PAID").length, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Addresses", value: addresses.length, icon: TrendingUp, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-foreground mb-8">My Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-56 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${isActive ? "bg-accent text-accent-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === "orders" && <OrderHistory orders={orders} />}
            {activeTab === "addresses" && <AddressManagement addresses={addresses} onRefresh={refreshProfile} />}
            {activeTab === "wallet" && <WalletSection wallet={wallet} onRefresh={refreshProfile} />}
            {activeTab === "profile" && <ProfileSettings user={user} />}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;