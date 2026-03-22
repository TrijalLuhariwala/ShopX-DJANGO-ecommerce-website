import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
        toast({ title: "Welcome back!", description: "Logged in successfully." });
      } else {
        await register(username, email, password, isSeller);
        toast({ title: "Account created!", description: "Welcome to ShopX." });
      }
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || (isLogin ? "Invalid credentials" : "Registration failed");
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-elevated p-8">

            <h1 className="font-display text-3xl text-foreground text-center mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-center text-sm mb-8">
              {isLogin ? "Sign in to your account" : "Join ShopX today"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 bg-secondary border-0 h-11"
                  placeholder="Your username"
                  required />
              </div>

              {!isLogin &&
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 bg-secondary border-0 h-11"
                    placeholder="you@example.com" />
                </div>
              }

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary border-0 h-11 pr-10"
                    placeholder="••••••••"
                    required />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin &&
                <div className="bg-secondary/60 rounded-xl p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={isSeller}
                      onCheckedChange={(v) => setIsSeller(v)} />
                    <div>
                      <span className="text-sm font-medium text-foreground">Register as a Seller</span>
                      <p className="text-xs text-muted-foreground">List and sell your products on ShopX</p>
                    </div>
                  </label>
                </div>
              }

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold"
                disabled={isLoading}>
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setIsLogin(!isLogin); }}
                className="text-accent font-medium hover:underline">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;