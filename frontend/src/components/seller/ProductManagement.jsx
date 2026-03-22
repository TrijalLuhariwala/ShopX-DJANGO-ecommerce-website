import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, AlertTriangle, Loader2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { apiGetSellerDashboard, apiAddProduct, apiDeleteProduct, apiGetCategories, apiGetSubcategories } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const emptyForm = { name: "", price: "", description: "", stock_available: "", category_id: "", subcategory_id: "", discount_percent: "" };

const ProductManagement = () => {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { toast } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([apiGetSellerDashboard(), apiGetCategories()])
      .then(([dRes, cRes]) => {
        setProductsList(dRes.data.products || []);
        setCategories(cRes.data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (form.category_id) {
      apiGetSubcategories(form.category_id).then(({ data }) => setSubcategories(data));
    } else {
      setSubcategories([]);
    }
  }, [form.category_id]);

  const openAdd = () => {
    setForm(emptyForm);
    setImageFiles([]);
    setImagePreviews([]);
    setDialogOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - imageFiles.length);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      imageFiles.forEach((f) => fd.append("images", f));
      await apiAddProduct(fd);
      toast({ title: "Product added!" });
      setDialogOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to add product";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteProduct(id);
      toast({ title: "Product deleted" });
      setDeleteConfirm(null);
      loadData();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">My Products</h2>
        <Button onClick={openAdd} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {productsList.length === 0 ?
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No products yet. Add your first product!</p>
        </div> :
        <div className="space-y-3">
          {productsList.map((product, i) =>
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl border border-border p-4 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-center gap-4">
                {product.images?.[0] ?
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover shrink-0" /> :
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0"><Package size={24} className="text-muted-foreground" /></div>
                }
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{product.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{product.category}</span>
                    <span>₹{product.price}</span>
                  </div>
                </div>
                <div className="shrink-0 text-center hidden md:block">
                  <p className={`text-sm font-semibold ${product.stock_available === 0 ? "text-destructive" : product.stock_available <= 10 ? "text-warning" : "text-foreground"}`}>
                    {product.stock_available}
                  </p>
                  <p className="text-[10px] text-muted-foreground">stock</p>
                </div>
                <div className="shrink-0">
                  {product.stock_available === 0 ?
                    <Badge className="bg-destructive/10 text-destructive border-0 text-xs">Out of Stock</Badge> :
                    product.stock_available <= 10 ?
                      <Badge className="bg-warning/10 text-warning border-0 text-xs gap-1"><AlertTriangle size={10} /> Low</Badge> :
                      <Badge className="bg-success/10 text-success border-0 text-xs">Active</Badge>
                  }
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setDeleteConfirm(product.id)} className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {deleteConfirm === product.id &&
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-destructive">Delete this product?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>Delete</Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                  </div>
                </div>
              }
            </motion.div>
          )}
        </div>
      }

      {/* Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-sm font-medium">Product Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 bg-secondary border-0" placeholder="e.g. Wireless Headphones" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-sm font-medium">Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5 bg-secondary border-0" placeholder="0.00" /></div>
              <div><Label className="text-sm font-medium">Stock</Label><Input type="number" value={form.stock_available} onChange={(e) => setForm({ ...form, stock_available: e.target.value })} className="mt-1.5 bg-secondary border-0" placeholder="0" /></div>
            </div>
            <div><Label className="text-sm font-medium">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5 bg-secondary border-0 min-h-[80px]" placeholder="Describe your product..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v, subcategory_id: "" })}>
                  <SelectTrigger className="mt-1.5 bg-secondary border-0"><SelectValue placeholder="Select category..." /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Subcategory</Label>
                <Select value={form.subcategory_id} onValueChange={(v) => setForm({ ...form, subcategory_id: v })} disabled={!subcategories.length}>
                  <SelectTrigger className="mt-1.5 bg-secondary border-0"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{subcategories.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium">Product Images</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((src, idx) =>
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} className="text-background" />
                    </button>
                  </div>
                )}
                {imagePreviews.length < 5 &&
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground cursor-pointer hover:border-accent transition-colors">
                    <ImagePlus size={20} />
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">Upload up to 5 images. First image is the cover.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" disabled={!form.name || !form.price || saving}>
                {saving ? <><Loader2 size={16} className="animate-spin mr-2" />Saving...</> : "Add Product"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;