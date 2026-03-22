import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, CreditCard, Wallet, Smartphone, ChevronRight, ChevronLeft,
  CheckCircle2, Package, Truck, ShieldCheck, Plus, Loader2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiGetProfile, apiAddAddress, apiPlaceOrder, apiTopUpWallet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "wallet", label: "ShopX Wallet", icon: Wallet, desc: "Pay from your wallet balance" },
  { id: "cod", label: "Cash on Delivery", icon: Package, desc: "Pay when you receive" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [newAddress, setNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ full_name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [addresses, setAddresses] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const shipping = totalPrice >= 500 ? 0 : 49;
  const tax = totalPrice * 0.05;
  const grandTotal = totalPrice + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) { navigate("/auth"); return; }
    apiGetProfile()
      .then(({ data }) => {
        setAddresses(data.addresses || []);
        setWalletBalance(data.wallet?.balance || 0);
        if (data.addresses?.length) setSelectedAddress(String(data.addresses[0].id));
      })
      .catch(() => { })
      .finally(() => setLoadingProfile(false));
  }, [isAuthenticated]);

  const addNewAddress = async () => {
    try {
      const { data } = await apiAddAddress(addressForm);
      setAddresses((prev) => [...prev, data]);
      setSelectedAddress(String(data.id));
      setNewAddress(false);
      setAddressForm({ full_name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to add address", variant: "destructive" });
    }
  };

  const placeOrder = async () => {
    setIsPlacing(true);
    try {
      const { data } = await apiPlaceOrder(selectedAddress);
      setOrderId(`ORD-${data.order_id}`);
      clearCart();
      setWalletBalance((prev) => prev - data.total);
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to place order";
      toast({ title: "Order Failed", description: msg, variant: "destructive" });
    } finally {
      setIsPlacing(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedAddress;
    if (step === 2) return !!selectedPayment;
    return true;
  };

  const selectedAddr = addresses.find((a) => String(a.id) === selectedAddress);
  const selectedPay = paymentMethods.find((p) => p.id === selectedPayment);
  const steps = [{ num: 1, label: "Address" }, { num: 2, label: "Payment" }, { num: 3, label: "Review" }, { num: 4, label: "Confirmation" }];

  if (loadingProfile) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={40} className="animate-spin text-accent" />
    </div>
  );

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-display text-2xl text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out</p>
          <Button onClick={() => navigate("/products")} className="bg-accent text-accent-foreground hover:bg-accent/90">Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {step !== 4 &&
          <div className="flex items-center justify-center mb-10">
            {steps.slice(0, 3).map((s, i) =>
              <div key={s.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.num ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {step > s.num ? <CheckCircle2 size={18} /> : s.num}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                </div>
                {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-3 transition-colors ${step > s.num ? "bg-accent" : "bg-border"}`} />}
              </div>
            )}
          </div>
        }

        <div className={`${step !== 4 ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}`}>
          <div className={step !== 4 ? "lg:col-span-2" : ""}>
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {step === 1 &&
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-display text-2xl text-foreground">Delivery Address</h2>
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                    {addresses.map((addr) =>
                      <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === String(addr.id) ? "border-accent bg-accent/5 shadow-soft" : "border-border bg-card hover:border-accent/30"}`}>
                        <RadioGroupItem value={String(addr.id)} className="mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin size={14} className="text-accent" />
                            <span className="font-semibold text-sm text-foreground">{addr.full_name}</span>
                          </div>
                          <p className="text-sm text-foreground">{addr.street}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                        </div>
                      </label>
                    )}
                  </RadioGroup>

                  {!newAddress ?
                    <button onClick={() => setNewAddress(true)} className="flex items-center gap-2 text-sm text-accent font-medium hover:underline">
                      <Plus size={16} /> Add new address
                    </button> :
                    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                      <h3 className="font-body font-semibold text-foreground">New Address</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-sm">Full Name</Label><Input value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                        <div><Label className="text-sm">Phone</Label><Input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                      </div>
                      <div><Label className="text-sm">Street</Label><Input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><Label className="text-sm">City</Label><Input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                        <div><Label className="text-sm">State</Label><Input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                        <div><Label className="text-sm">Pincode</Label><Input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="mt-1 bg-secondary border-0" /></div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addNewAddress} className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!addressForm.full_name || !addressForm.street}>Save & Select</Button>
                        <Button variant="outline" onClick={() => setNewAddress(false)}>Cancel</Button>
                      </div>
                    </div>
                  }
                </motion.div>
              }

              {/* Step 2: Payment */}
              {step === 2 &&
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-display text-2xl text-foreground">Payment Method</h2>
                  <div className="bg-card rounded-xl border border-border p-4 mb-4">
                    <p className="text-sm text-muted-foreground">Wallet Balance: <span className="text-foreground font-bold">₹{walletBalance.toFixed(2)}</span></p>
                    {walletBalance < grandTotal &&
                      <p className="text-xs text-destructive mt-1">Insufficient wallet balance. Please top up from your dashboard.</p>
                    }
                  </div>
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-3">
                    {paymentMethods.map((method) =>
                      <label key={method.id} className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === method.id ? "border-accent bg-accent/5 shadow-soft" : "border-border bg-card hover:border-accent/30"}`}>
                        <RadioGroupItem value={method.id} />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPayment === method.id ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
                          <method.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{method.label}</p>
                          <p className="text-xs text-muted-foreground">{method.desc}</p>
                        </div>
                      </label>
                    )}
                  </RadioGroup>
                </motion.div>
              }

              {/* Step 3: Review */}
              {step === 3 &&
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="font-display text-2xl text-foreground">Review Your Order</h2>
                  <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-body font-semibold text-foreground text-sm flex items-center gap-2"><MapPin size={14} className="text-accent" /> Delivery Address</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-accent hover:underline">Change</button>
                    </div>
                    {selectedAddr && <div>
                      <p className="text-sm font-medium text-foreground">{selectedAddr.full_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAddr.street}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}</p>
                    </div>}
                  </div>
                  <div className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-body font-semibold text-foreground text-sm flex items-center gap-2"><CreditCard size={14} className="text-accent" /> Payment</h3>
                      <button onClick={() => setStep(2)} className="text-xs text-accent hover:underline">Change</button>
                    </div>
                    {selectedPay && <div className="flex items-center gap-3"><selectedPay.icon size={18} className="text-muted-foreground" /><p className="text-sm text-foreground">{selectedPay.label}</p></div>}
                  </div>
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-body font-semibold text-foreground text-sm mb-4">Items ({items.length})</h3>
                    <div className="space-y-4">
                      {items.map((item) =>
                        <div key={item.product.id} className="flex items-center gap-4">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              }

              {/* Step 4: Confirmation */}
              {step === 4 &&
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-success" />
                  </motion.div>
                  <h2 className="font-display text-3xl text-foreground mb-2">Order Placed!</h2>
                  <p className="text-muted-foreground mb-2">Thank you for your purchase</p>
                  {orderId && <Badge className="bg-secondary text-foreground border-0 text-sm font-mono mb-8">{orderId}</Badge>}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <Button onClick={() => navigate("/account")} variant="outline" className="gap-2"><Package size={16} /> View Orders</Button>
                    <Button onClick={() => navigate("/products")} className="bg-accent text-accent-foreground hover:bg-accent/90">Continue Shopping</Button>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Truck size={14} /> Free Shipping</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure Payment</span>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {step !== 4 &&
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-xl border border-border p-6 shadow-soft space-y-5">
                <h3 className="font-display text-lg text-foreground">Order Summary</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {items.map((item) =>
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-success font-medium" : "text-foreground"}>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax (5%)</span><span className="text-foreground">₹{tax.toFixed(2)}</span></div>
                  <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold text-foreground">Total</span><span className="font-bold text-lg text-foreground">₹{grandTotal.toFixed(2)}</span></div>
                </div>
                <div className="space-y-2">
                  {step === 3 ?
                    <Button onClick={placeOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold" disabled={isPlacing || (selectedPayment === "wallet" && walletBalance < grandTotal)}>
                      {isPlacing ? <><Loader2 size={16} className="animate-spin mr-2" />Placing Order...</> : `Place Order · ₹${grandTotal.toFixed(2)}`}
                    </Button> :
                    <Button onClick={() => setStep(step + 1)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold gap-2" disabled={!canProceed()}>
                      Continue <ChevronRight size={16} />
                    </Button>
                  }
                  {step > 1 && <Button variant="outline" className="w-full gap-2" onClick={() => setStep(step - 1)}><ChevronLeft size={16} /> Back</Button>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                  <ShieldCheck size={14} /><span>Secure checkout</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;