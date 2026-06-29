import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const { signIn, user, isSetupComplete } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Already set up — go straight to dashboard
  if (user && isSetupComplete) {
    navigate("/dashboard");
    return null;
  }

  const handleStart = () => {
    if (!name.trim()) return;
    signIn({ name: name.trim(), phone: phone.trim() });
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <Mountain className="h-8 w-8 text-accent" />
            <span className="font-display text-2xl font-bold text-foreground">Aware</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Get started</h1>
          <p className="font-body text-muted-foreground">
            No account needed. Just your name and we're good to go.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="space-y-2">
            <Label className="font-body">Your name *</Label>
            <Input
              placeholder="Joe Tolerico"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body">
              Phone number <span className="text-muted-foreground">(optional — for SMS check-ins later)</span>
            </Label>
            <Input
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
          </div>

          <Button
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full font-body font-bold py-5 mt-2"
            style={{ background: "var(--gradient-accent)" }}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
