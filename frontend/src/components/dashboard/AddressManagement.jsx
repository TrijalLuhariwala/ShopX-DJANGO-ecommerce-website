import { useState } from "react";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiAddAddress, apiDeleteAddress } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const emptyForm = { full_name: "", phone: "", street: "", city: "", state: "", pincode: "" };

const AddressManagement = ({ addresses = [], onRefresh }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();

  const handleAdd = async () => {
    setSaving(true);
    try {
      await apiAddAddress(form);
      toast({ title: "Address added!" });
      setForm(emptyForm);
      setAddOpen(false);
      onRefresh?.();
    } catch {
      toast({ title: "Error", description: "Failed to add address", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await apiDeleteAddress(id);
      toast({ title: "Address removed" });
      onRefresh?.();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">My Addresses</h2>
        <Button onClick={() => setAddOpen(!addOpen)} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
          <Plus size={16} /> Add Address
        </Button>
      </div>

      {addOpen && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h3 className="font-body font-semibold text-foreground">New Address</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-sm">Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
            <div><Label className="text-sm">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
          </div>
          <div><Label className="text-sm">Street</Label><Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-sm">City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
            <div><Label className="text-sm">State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
            <div><Label className="text-sm">Pincode</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!form.full_name || !form.street || saving}>
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null} Save Address
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No addresses saved yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr, i) =>
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl border border-border p-5 shadow-soft flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{addr.full_name}</p>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                disabled={deletingId === addr.id}>
                {deletingId === addr.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;