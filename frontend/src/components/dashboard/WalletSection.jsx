import { useState } from "react";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { apiTopUpWallet } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const WalletSection = ({ wallet, onRefresh }) => {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const balance = wallet?.balance ?? 0;

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;
    setLoading(true);
    try {
      await apiTopUpWallet(amount);
      toast({ title: "Wallet topped up!", description: `₹${amount} added to your wallet.` });
      setTopUpAmount("");
      setTopUpOpen(false);
      onRefresh?.();
    } catch {
      toast({ title: "Error", description: "Top-up failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 250, 500, 1000];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">My Wallet</h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero text-primary-foreground rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/60 text-sm font-medium mb-1">Available Balance</p>
            <p className="text-4xl font-bold">₹{balance.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <WalletIcon size={28} className="text-accent" />
          </div>
        </div>
        <Button onClick={() => setTopUpOpen(true)} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 gap-2 font-semibold">
          <Plus size={16} /> Top Up Wallet
        </Button>
      </motion.div>

      <div>
        <h3 className="font-body font-semibold text-foreground mb-4">Wallet Info</h3>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowDownLeft size={18} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Current Balance</p>
              <p className="text-xs text-muted-foreground">Used for purchases at checkout</p>
            </div>
            <p className="ml-auto text-sm font-bold text-success">₹{balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Top Up Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="bg-secondary border-0 h-12 text-lg font-semibold text-center"
              placeholder="Enter amount"
              min="1" />
            <div className="flex gap-2">
              {quickAmounts.map((amt) =>
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(String(amt))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${topUpAmount === String(amt) ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-foreground border-border hover:border-accent"}`}>
                  ₹{amt}
                </button>
              )}
            </div>
            <Button onClick={handleTopUp} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold" disabled={!topUpAmount || parseFloat(topUpAmount) <= 0 || loading}>
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Add ₹{topUpAmount || "0"} to Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletSection;