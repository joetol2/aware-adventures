import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mountain, LogOut, Plus, MapPin, Clock, CheckCircle, AlertTriangle, ChevronRight, X, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type CheckIn = {
  id: string;
  destination: string;
  activity_type: string;
  notes: string | null;
  started_at: string;
  expected_return_at: string;
  checked_in_at: string | null;
  status: "active" | "completed" | "missed" | "cancelled";
};

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
};

const ACTIVITIES = [
  "Hiking", "Climbing", "Trail Running", "Backpacking",
  "Mountain Biking", "Kayaking", "Skiing", "Fishing", "Other",
];

const DURATION_PRESETS = [
  { label: "2 hours", hours: 2 },
  { label: "4 hours", hours: 4 },
  { label: "8 hours", hours: 8 },
  { label: "1 day", hours: 24 },
  { label: "2 days", hours: 48 },
  { label: "Custom", hours: 0 },
];

function useCountdown(targetIso: string | null) {
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!targetIso) return;
    const tick = () => setRemaining(Math.max(0, new Date(targetIso).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return { remaining, h, m, s };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: CheckIn["status"] }) {
  const map = {
    active:    { label: "Active",     cls: "bg-accent/20 text-accent border-accent/30" },
    completed: { label: "Safe",       cls: "bg-green-500/20 text-green-400 border-green-500/30" },
    missed:    { label: "Missed",     cls: "bg-red-500/20 text-red-400 border-red-500/30" },
    cancelled: { label: "Cancelled",  cls: "bg-muted/40 text-muted-foreground border-border" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

function ActiveCheckIn({
  checkIn,
  contacts,
  onSafe,
  onExtend,
  onCancel,
}: {
  checkIn: CheckIn;
  contacts: EmergencyContact[];
  onSafe: () => void;
  onExtend: () => void;
  onCancel: () => void;
}) {
  const { remaining, h, m, s } = useCountdown(checkIn.expected_return_at);
  const overdue = remaining === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 md:p-8 ${
        overdue
          ? "border-red-500/40 bg-red-500/5"
          : "border-accent/30 bg-accent/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Active check-in
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {checkIn.destination}
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {checkIn.activity_type} · Started {formatDate(checkIn.started_at)}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors mt-1"
          title="Cancel check-in"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Countdown */}
      <div className={`rounded-xl p-6 text-center mb-6 ${overdue ? "bg-red-500/10" : "bg-background/60"}`}>
        {overdue ? (
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <p className="font-display text-xl font-bold text-red-400">Check-in window passed</p>
            <p className="font-body text-sm text-muted-foreground">
              Your contacts would be alerted now once Twilio is connected.
            </p>
          </div>
        ) : (
          <>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Time remaining
            </p>
            <div className="font-display text-5xl md:text-6xl font-bold text-foreground tabular-nums">
              {String(h).padStart(2, "0")}
              <span className="text-accent mx-1">:</span>
              {String(m).padStart(2, "0")}
              <span className="text-accent mx-1">:</span>
              {String(s).padStart(2, "0")}
            </div>
            <p className="font-body text-sm text-muted-foreground mt-3">
              Expected back by {formatDate(checkIn.expected_return_at)}
            </p>
          </>
        )}
      </div>

      {/* Contacts who will be alerted */}
      {contacts.length > 0 && (
        <div className="mb-6">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Will alert
          </p>
          <div className="flex flex-wrap gap-2">
            {contacts.map((c) => (
              <span key={c.id} className="px-3 py-1.5 rounded-lg bg-background/60 border border-border text-sm font-body text-foreground">
                {c.name} {c.relationship ? `(${c.relationship})` : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {checkIn.notes && (
        <p className="font-body text-sm text-muted-foreground mb-6 italic">
          "{checkIn.notes}"
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onSafe}
          className="flex-1 font-body font-bold text-base py-6"
          style={{ background: "var(--gradient-accent)" }}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          I'm Back Safe
        </Button>
        <Button
          onClick={onExtend}
          variant="outline"
          className="font-body font-semibold"
        >
          <Timer className="h-4 w-4 mr-2" />
          Extend 1 Hour
        </Button>
      </div>
    </motion.div>
  );
}

function NewCheckInForm({
  onSave,
  onCancel,
}: {
  onSave: (data: { destination: string; activity_type: string; notes: string; expected_return_at: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [destination, setDestination] = useState("");
  const [activity, setActivity] = useState("Hiking");
  const [notes, setNotes] = useState("");
  const [durationPreset, setDurationPreset] = useState(4);
  const [customHours, setCustomHours] = useState("");
  const [saving, setSaving] = useState(false);

  const isCustom = durationPreset === 0;
  const hours = isCustom ? parseFloat(customHours) || 0 : durationPreset;
  const canSave = destination.trim().length > 0 && hours > 0;

  const handleSave = async () => {
    setSaving(true);
    const expected_return_at = new Date(Date.now() + hours * 3_600_000).toISOString();
    await onSave({ destination: destination.trim(), activity_type: activity, notes: notes.trim(), expected_return_at });
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">New check-in</h2>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="font-body">Destination *</Label>
          <Input
            placeholder="e.g. Bishop Pass trailhead, CA"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-body">Activity</Label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((a) => (
              <button
                key={a}
                onClick={() => setActivity(a)}
                className={`px-3 py-1.5 rounded-lg font-body text-sm font-medium border transition-all ${
                  activity === a
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-accent"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-body">Expected return</Label>
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setDurationPreset(p.hours)}
                className={`px-3 py-1.5 rounded-lg font-body text-sm font-medium border transition-all ${
                  durationPreset === p.hours
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-accent"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {isCustom && (
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="Hours"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                className="w-32"
              />
              <span className="font-body text-sm text-muted-foreground">hours from now</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="font-body">Notes <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            placeholder="Trail conditions, parking, anything useful for rescuers"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="flex-1 font-body font-bold py-5"
          style={{ background: "var(--gradient-accent)" }}
        >
          {saving ? "Starting..." : "Start Check-in"}
        </Button>
      </div>
    </motion.div>
  );
}

function TripHistory({ trips }: { trips: CheckIn[] }) {
  if (trips.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Trip history</h3>
      <div className="space-y-3">
        {trips.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                <p className="font-body font-semibold text-foreground text-sm truncate">{t.destination}</p>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                {t.activity_type} · {formatDate(t.started_at)}
              </p>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<any>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [activeCheckIn, setActiveCheckIn] = useState<CheckIn | null>(null);
  const [pastCheckIns, setPastCheckIns] = useState<CheckIn[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    const [profileRes, contactsRes, checkInsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("emergency_contacts").select("*").eq("user_id", user.id),
      supabase.from("check_ins").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) {
      if (!profileRes.data.onboarding_completed) {
        navigate("/onboarding");
        return;
      }
      setProfile(profileRes.data);
    }

    if (contactsRes.data) setContacts(contactsRes.data);

    if (checkInsRes.data) {
      const active = checkInsRes.data.find((c) => c.status === "active") as CheckIn | undefined;
      setActiveCheckIn(active ?? null);
      setPastCheckIns(checkInsRes.data.filter((c) => c.status !== "active") as CheckIn[]);
    }

    setDataLoading(false);
  }, [user, navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleNewCheckIn = async (data: {
    destination: string;
    activity_type: string;
    notes: string;
    expected_return_at: string;
  }) => {
    if (!user) return;
    const { error } = await supabase.from("check_ins").insert({ user_id: user.id, ...data });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Check-in started", description: "We'll alert your contacts if you don't return on time." });
    setShowForm(false);
    await loadData();
  };

  const handleSafe = async () => {
    if (!activeCheckIn) return;
    const { error } = await supabase
      .from("check_ins")
      .update({ status: "completed", checked_in_at: new Date().toISOString() })
      .eq("id", activeCheckIn.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Welcome back!", description: "Your check-in is complete. Stay safe out there." });
    await loadData();
  };

  const handleExtend = async () => {
    if (!activeCheckIn) return;
    const newTime = new Date(new Date(activeCheckIn.expected_return_at).getTime() + 3_600_000).toISOString();
    const { error } = await supabase
      .from("check_ins")
      .update({ expected_return_at: newTime })
      .eq("id", activeCheckIn.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Extended 1 hour", description: `New expected return: ${formatDate(newTime)}` });
    await loadData();
  };

  const handleCancel = async () => {
    if (!activeCheckIn) return;
    const { error } = await supabase
      .from("check_ins")
      .update({ status: "cancelled" })
      .eq("id", activeCheckIn.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Check-in cancelled" });
    await loadData();
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Mountain className="h-8 w-8 text-accent animate-pulse" />
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || "Adventurer";
  const totalTrips = pastCheckIns.length + (activeCheckIn ? 1 : 0);
  const safeTrips = pastCheckIns.filter((c) => c.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">Aware</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-muted-foreground hidden sm:block">
            {profile?.full_name || user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Hey, {firstName}.
            </h1>
            <p className="font-body text-muted-foreground mt-1">
              {activeCheckIn ? "You have an active check-in." : "Ready for your next adventure?"}
            </p>
          </div>
          {!activeCheckIn && !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="font-body font-bold shrink-0"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Check in
            </Button>
          )}
        </div>

        {/* Stats */}
        {totalTrips > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Total trips</p>
              <p className="font-display text-3xl font-bold text-foreground">{totalTrips}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Returned safe</p>
              <p className="font-display text-3xl font-bold text-green-400">{safeTrips}</p>
            </div>
          </div>
        )}

        {/* No contacts warning */}
        {contacts.length === 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-semibold text-foreground">No emergency contacts</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Add at least one contact so someone can be alerted if you don't check back in.
              </p>
            </div>
          </div>
        )}

        {/* Active check-in or form */}
        <AnimatePresence mode="wait">
          {activeCheckIn ? (
            <ActiveCheckIn
              key="active"
              checkIn={activeCheckIn}
              contacts={contacts}
              onSafe={handleSafe}
              onExtend={handleExtend}
              onCancel={handleCancel}
            />
          ) : showForm ? (
            <NewCheckInForm
              key="form"
              onSave={handleNewCheckIn}
              onCancel={() => setShowForm(false)}
            />
          ) : totalTrips === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-border p-12 text-center"
            >
              <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-display text-lg font-bold text-foreground mb-2">No trips yet</p>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Start your first check-in before your next adventure.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="font-body font-bold"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start a check-in
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* History */}
        <TripHistory trips={pastCheckIns} />
      </div>
    </div>
  );
}
