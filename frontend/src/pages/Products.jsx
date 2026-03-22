import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, X, Loader2 } from "lucide-react";
import { apiGetProducts, apiGetCategories } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryParam ? [categoryParam] : []
  );
  const [viewMode, setViewMode] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetProducts(), apiGetCategories()])
      .then(([pRes, cRes]) => {
        // Normalise backend products to frontend shape
        const normalised = pRes.data.map((p) => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          originalPrice: p.discount_percent > 0 ? +(p.price / (1 - p.discount_percent / 100)).toFixed(2) : undefined,
          description: p.description,
          stockAvailable: p.stock_available,
          category: p.category?.toLowerCase().replace(/\s+/g, "-") || "",
          subcategory: p.subcategory?.toLowerCase() || "",
          seller: { id: p.seller?.id, name: p.seller?.username, rating: 4.5 },
          images: p.images?.length ? p.images : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"],
          rating: 4.5,
          reviewCount: 0,
        }));
        setProducts(normalised);
        setCategories(cRes.data.map((c) => ({
          id: String(c.id),
          name: c.name,
          slug: c.name.toLowerCase().replace(/\s+/g, "-"),
        })));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [search, selectedCategories, priceRange, sortBy, products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Products</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-foreground">All Products</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>
              <SlidersHorizontal size={16} className="mr-2" /> Filters
            </Button>
            <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-0.5">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}><Grid3X3 size={16} /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}><List size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`w-64 shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-28 space-y-8">
              <div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-0" />
                </div>
              </div>

              <div>
                <h3 className="font-body font-semibold text-sm text-foreground mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) =>
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => toggleCategory(cat.slug)} />
                      <span className="text-sm text-foreground">{cat.name}</span>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-body font-semibold text-sm text-foreground mb-3">Price Range</h3>
                <Slider value={priceRange} onValueChange={setPriceRange} max={5000} min={0} step={50} className="mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-body font-semibold text-sm text-foreground mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-secondary border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategories.length > 0 &&
                <Button variant="outline" size="sm" onClick={() => setSelectedCategories([])}>
                  <X size={14} className="mr-1" /> Clear Filters
                </Button>
              }
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-accent" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">{filtered.length} products found</p>
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                  {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
                {filtered.length === 0 &&
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No products found</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                  </div>
                }
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;