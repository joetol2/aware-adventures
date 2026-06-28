import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mountain, LogOut, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data && !data.onboarding_completed) {
            navigate("/onboarding");
          } else {
            setProfile(data);
          }
        });
    }
  }, [user, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Mountain className="h-8 w-8 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">Aware</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-muted-foreground">
            {profile.full_name || user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-7 w-7 text-accent" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Welcome, {profile.full_name?.split(" ")[0] || "Adventurer"}!
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-2">
          Your Basic plan is active. You're ready to start your first check-in.
        </p>
        <p className="font-body text-muted-foreground text-sm">
          The check-in system is coming soon. We'll notify you when it's ready.
        </p>
      </div>
    </div>
  );
}
