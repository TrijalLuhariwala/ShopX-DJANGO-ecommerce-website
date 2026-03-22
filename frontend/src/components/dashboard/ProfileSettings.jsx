import { useAuth } from "@/context/AuthContext";
import { UserCircle } from "lucide-react";

const ProfileSettings = ({ user }) => {
  const { logout } = useAuth();
  const u = user || {};

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Profile</h2>

      <div className="bg-card rounded-xl border border-border p-6 shadow-soft flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <UserCircle size={36} className="text-accent" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{u.username || "—"}</p>
          <p className="text-sm text-muted-foreground">{u.email || "No email provided"}</p>
          <p className="text-xs mt-1 font-medium">
            {u.is_seller
              ? <span className="text-accent">Seller Account</span>
              : <span className="text-muted-foreground">Buyer Account</span>
            }
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-3 shadow-soft">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Username</span>
          <span className="text-foreground font-medium">{u.username || "—"}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border pt-3">
          <span className="text-muted-foreground">Email</span>
          <span className="text-foreground font-medium">{u.email || "—"}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border pt-3">
          <span className="text-muted-foreground">Account Type</span>
          <span className="text-foreground font-medium">{u.is_seller ? "Seller" : "Buyer"}</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors">
        Sign Out
      </button>
    </div>
  );
};

export default ProfileSettings;