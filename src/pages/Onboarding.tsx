import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, ArrowRight, ArrowLeft, User, Phone, Shield, MapPin, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ACTIVITY_TYPES = [
  "Hiking", "Climbing", "Trail Running", "Backpacking",
  "Mountain Biking", "Kayaking", "Skiing", "Fishing",
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function Onboarding() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1: Profile
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Emergency contact
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");

  // Step 3: Activity preferences
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      // Check if onboarding already completed
      supabase
        .from("profiles")
        .select("onboarding_completed, full_name, phone")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.onboarding_completed) {
            navigate("/dashboard");
          } else {
            setFullName(data?.full_name || user.user_metadata?.full_name || "");
            setPhone(data?.phone || "");
          }
        });
    }
  }, [user, navigate]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone, onboarding_completed: true })
        .eq("user_id", user.id);
      if (profileError) throw profileError;

      // Add emergency contact
      if (contactName && contactPhone) {
        const { error: contactError } = await supabase
          .from("emergency_contacts")
          .insert({
            user_id: user.id,
            name: contactName,
            phone: contactPhone,
            email: contactEmail || null,
            relationship: contactRelationship || null,
          });
        if (contactError) throw contactError;
      }

      // Add activity preferences
      if (selectedActivities.length > 0) {
        const { error: activityError } = await supabase
          .from("activity_preferences")
          .insert(
            selectedActivities.map((activity) => ({
              user_id: user.id,
              activity_type: activity,
              experience_level: experienceLevel.toLowerCase(),
            }))
          );
        if (activityError) throw activityError;
      }

      toast({ title: "Welcome to Aware!", description: "Your account is all set up." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    {
      title: "Your Profile",
      subtitle: "Tell us a bit about yourself",
      icon: User,
    },
    {
      title: "Emergency Contact",
      subtitle: "Who should we notify if you don't check back in?",
      icon: Shield,
    },
    {
      title: "Your Adventures",
      subtitle: "What activities do you enjoy?",
      icon: MapPin,
    },
  ];

  const canProceed = () => {
    if (step === 0) return fullName.trim().length > 0;
    if (step === 1) return contactName.trim().length > 0 && contactPhone.trim().length > 0;
    if (step === 2) return selectedActivities.length > 0;
    return false;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Mountain className="h-8 w-8 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">Aware</span>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-accent" : i < step ? "w-2 bg-accent/60" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step header */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const Icon = steps[step].icon;
                    return <Icon className="h-6 w-6 text-accent" />;
                  })()}
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  {steps[step].title}
                </h2>
                <p className="font-body text-muted-foreground">{steps[step].subtitle}</p>
              </div>

              {/* Step 1: Profile */}
              {step === 0 && (
                <div className="space-y-4 bg-card border border-border rounded-2xl p-6">
                  <div className="space-y-2">
                    <Label className="font-body">Full Name *</Label>
                    <Input
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Phone Number</Label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground font-body">
                      Used for SMS check-ins and emergency notifications
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Emergency Contact */}
              {step === 1 && (
                <div className="space-y-4 bg-card border border-border rounded-2xl p-6">
                  <div className="space-y-2">
                    <Label className="font-body">Contact Name *</Label>
                    <Input
                      placeholder="Emergency contact's name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Phone Number *</Label>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Email</Label>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Relationship</Label>
                    <Input
                      placeholder="e.g., Spouse, Parent, Friend"
                      value={contactRelationship}
                      onChange={(e) => setContactRelationship(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Activities */}
              {step === 2 && (
                <div className="space-y-6 bg-card border border-border rounded-2xl p-6">
                  <div>
                    <Label className="font-body mb-3 block">Select your activities *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {ACTIVITY_TYPES.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => toggleActivity(activity)}
                          className={`px-4 py-3 rounded-xl font-body text-sm font-medium transition-all border ${
                            selectedActivities.includes(activity)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-foreground hover:border-accent"
                          }`}
                        >
                          {selectedActivities.includes(activity) && (
                            <Check className="h-3.5 w-3.5 inline mr-1.5" />
                          )}
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-body mb-3 block">Experience Level</Label>
                    <div className="flex gap-2 flex-wrap">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => setExperienceLevel(level)}
                          className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all border ${
                            experienceLevel === level
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-background border-border text-foreground hover:border-accent"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="font-body"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="font-body font-bold"
                style={{ background: "var(--gradient-accent)" }}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || saving}
                className="font-body font-bold"
                style={{ background: "var(--gradient-accent)" }}
              >
                {saving ? "Setting up..." : "Complete Setup"}
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
