import { useEffect, useState } from "react";
import { BarChart3, Database, Gauge, RefreshCw, ShieldCheck, TrendingUp, Users, ShoppingBag, IndianRupee } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { apiGetAnalyticsDashboard, apiGetQueryLab } from "@/lib/api";

const formatMoney = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [dashboardResponse, labResponse] = await Promise.all([apiGetAnalyticsDashboard(), apiGetQueryLab()]);
      setDashboard(dashboardResponse.data); setLab(labResponse.data);
    } catch {
      setError("Analytics data is unavailable. Start the Django API and refresh this page.");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const kpis = dashboard?.kpis || {};
  const cards = [
    ["Revenue", formatMoney(kpis.revenue), IndianRupee], ["Paid orders", kpis.orders ?? 0, ShoppingBag],
    ["Customers", kpis.customers ?? 0, Users], ["Repeat purchase", `${kpis.repeat_purchase_rate ?? 0}%`, TrendingUp],
  ];

  return <div className="min-h-screen bg-background">
    <Header /><CartSidebar />
    <main className="container mx-auto px-4 py-8 space-y-7">
      <section className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-9 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div><p className="text-primary-foreground/70 text-sm font-medium mb-2">SHOPX × RETAILPULSE AI</p><h1 className="font-display text-3xl md:text-4xl">Retail analytics & query intelligence</h1><p className="mt-3 max-w-2xl text-primary-foreground/80">A governed analytics layer built on live ShopX orders—turning operational data into customer, product and performance insight.</p></div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/15 hover:bg-white/25 px-4 py-2.5 text-sm font-medium"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh data</button>
        </div>
      </section>
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-xl border bg-card p-5 shadow-soft"><div className="flex justify-between text-muted-foreground"><span className="text-sm">{label}</span><Icon size={18} /></div><p className="mt-3 text-2xl font-bold text-foreground">{loading ? "—" : value}</p>{label === "Revenue" && <p className="text-xs text-muted-foreground mt-1">AOV {formatMoney(kpis.aov)}</p>}</div>)}</section>
      <section className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-xl border bg-card p-5"><div className="flex items-center gap-2 mb-5"><BarChart3 size={19} className="text-accent" /><h2 className="font-semibold">Monthly revenue trend</h2></div><div className="h-72">{dashboard?.revenue_trend?.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.revenue_trend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `₹${v}`} /><Tooltip formatter={(v) => formatMoney(v)} /><Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="h-full grid place-items-center text-sm text-muted-foreground">Complete paid orders to populate the trend.</div>}</div></div>
        <div className="lg:col-span-2 rounded-xl border bg-card p-5"><h2 className="font-semibold mb-4">Top products</h2><div className="space-y-4">{dashboard?.top_products?.length ? dashboard.top_products.map((item, i) => <div key={item.product} className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-secondary text-xs grid place-items-center">{i + 1}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{item.product}</p><p className="text-xs text-muted-foreground">{item.category} · {item.units} units</p></div><p className="text-sm font-semibold">{formatMoney(item.revenue)}</p></div>) : <p className="text-sm text-muted-foreground">No sales data yet.</p>}</div></div>
      </section>
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-xl border bg-card p-5"><div className="flex gap-2 items-center"><Database size={19} className="text-accent" /><h2 className="font-semibold">Data engineering pipeline</h2></div><p className="text-sm text-muted-foreground mt-2">{dashboard?.pipeline?.source || "Loading source metadata…"}</p><div className="mt-4 rounded-lg bg-secondary p-3 text-xs text-secondary-foreground">Model: {dashboard?.pipeline?.model || "—"}</div><div className="mt-4 grid grid-cols-2 gap-3">{dashboard?.pipeline?.quality_checks?.map(check => <div key={check.name} className="rounded-lg border p-3"><div className="flex items-center gap-1.5 text-xs text-emerald-600"><ShieldCheck size={14} /> {check.status}</div><p className="mt-1 text-sm font-medium">{check.name}</p><p className="text-xl font-bold">{check.value}</p></div>)}</div></div>
        <div className="rounded-xl border bg-card p-5"><div className="flex gap-2 items-center"><Gauge size={19} className="text-accent" /><h2 className="font-semibold">Query Lab</h2></div><p className="mt-2 text-sm text-muted-foreground">Controlled analytical query: {lab?.query_name || "Loading…"}</p><div className="mt-4 rounded-lg bg-slate-950 p-3 text-xs text-slate-100 overflow-auto max-h-32 whitespace-pre-wrap font-mono">{lab?.execution_plan || "Fetching database execution plan…"}</div><p className="mt-4 text-sm font-medium">Optimization guidance</p><ul className="mt-2 text-sm text-muted-foreground space-y-2 list-disc pl-5">{lab?.recommendations?.map(item => <li key={item}>{item}</li>)}</ul></div>
      </section>
    </main><Footer />
  </div>;
};

export default Analytics;
