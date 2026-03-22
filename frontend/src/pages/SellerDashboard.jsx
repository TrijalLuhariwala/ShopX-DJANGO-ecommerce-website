import { useState, useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import SellerOverview from "@/components/seller/SellerOverview";
import ProductManagement from "@/components/seller/ProductManagement";
import SellerOrderManagement from "@/components/seller/SellerOrderManagement";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.isSeller)) {
      navigate("/");
    }
  }, [isAuthenticated, user, loading]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
            <LayoutDashboard size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-foreground">Seller Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.username}</p>
          </div>
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
            {activeTab === "overview" && <SellerOverview />}
            {activeTab === "products" && <ProductManagement />}
            {activeTab === "orders" && <SellerOrderManagement />}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerDashboard;